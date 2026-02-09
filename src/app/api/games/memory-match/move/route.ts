import { pusher } from "@/lib/pusher";
import { getGame, updateGame, updatePlayerStats } from "@/lib/game-store";

export async function POST(request: Request) {
	const { gameId, cardId, userId } = await request.json();

	const game = await getGame(gameId);

	if (!game) {
		return Response.json({ error: "Game not found" }, { status: 404 });
	}

	if (game.status !== "in-progress") {
		return Response.json({ error: "Game is not in progress" }, { status: 400 });
	}

	if (game.currentTurn !== userId) {
		return Response.json({ error: "Not your turn" }, { status: 403 });
	}

	const card = game.cards[cardId];
	if (!card || card.isFlipped || card.isMatched) {
		return Response.json({ error: "Invalid move" }, { status: 400 });
	}

	// Flip the card
	game.cards[cardId].isFlipped = true;

	// Broadcast the flip immediately to all players
	await pusher.trigger(`memory-match-${gameId}`, "card-flipped", {
		cardId,
		userId,
		game,
	});

	// Check if we need to evaluate a match (after 2 cards are flipped)
	const flippedCardIds = game.cards
		.map((c, index) => (c.isFlipped && !c.isMatched ? index : -1))
		.filter((id) => id !== -1);

	if (flippedCardIds.length === 2) {
		game.moves++;
		const [first, second] = flippedCardIds;
		let matchFound = false;

		if (game.cards[first].word === game.cards[second].word) {
			// Match found
			game.cards[first].isMatched = true;
			game.cards[second].isMatched = true;
			matchFound = true;

			const player = game.players.find((p) => p.id === userId);
			if (player) player.score++;

			if (game.cards.every((c) => c.isMatched)) {
				game.status = "completed";
				
				// Update player stats
				if (game.players.length === 2) {
					const [p1, p2] = game.players;
					const winner = p1.score > p2.score ? p1.id : p2.score > p1.score ? p2.id : null;
					await updatePlayerStats(winner, p1.id, p2.id);
				}
			}
		} else {
			// No match - flip cards back and switch turn
			game.cards[first].isFlipped = false;
			game.cards[second].isFlipped = false;

			const currentIdx = game.players.findIndex((p) => p.id === game.currentTurn);
			const nextIdx = (currentIdx + 1) % game.players.length;
			game.currentTurn = game.players[nextIdx].id;
		}

		// Broadcast match result
		await pusher.trigger(`memory-match-${gameId}`, "match-result", {
			matchFound,
			game,
			firstCardId: first,
			secondCardId: second,
		});
	}

	// Save updated game state to Redis
	await updateGame(gameId, game);

	return Response.json({ success: true, game });
}
