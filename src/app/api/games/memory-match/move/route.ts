import { pusher } from "@/src/lib/pusher";
import { getGame } from "@/src/lib/game-store";

export async function POST(request: Request) {
	const { gameId, cardId, userId } = await request.json();

	console.log("[Move API] Request received:", { gameId, cardId, userId });

	// Get current game state
	const game = getGame(gameId);

	console.log("[Move API] Game found:", game ? "Yes" : "No");

	if (!game) {
		return new Response(JSON.stringify({ error: "Game not found" }), {
			status: 404,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Validate game is in progress
	if (game.status !== "in-progress") {
		return new Response(JSON.stringify({ error: "Game is not in progress" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Validate it's the player's turn
	if (game.currentTurn !== userId) {
		return new Response(JSON.stringify({ error: "Not your turn" }), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Validate card can be flipped
	const card = game.cards[cardId];
	if (!card || card.isFlipped || card.isMatched) {
		return new Response(JSON.stringify({ error: "Invalid move" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	// Flip the card immediately
	game.cards[cardId].isFlipped = true;

	// Note: game is a reference to the object in the Map,
	// so modifications are automatically persisted

	// Broadcast the flip immediately
	console.log("[Move API] Broadcasting card-flipped event to channel:", `memory-match-${gameId}`);
	await pusher.trigger(`memory-match-${gameId}`, "card-flipped", {
		cardId,
		userId,
		game,
	});
	console.log("[Move API] Card-flipped event broadcasted successfully");

	// Check if we need to evaluate a match (after 2 cards are flipped)
	const flippedCardIds = game.cards
		.map((c, index) => (c.isFlipped && !c.isMatched ? index : -1))
		.filter((id) => id !== -1);
	if (flippedCardIds.length === 2) {
		game.moves++;
		const [first, second] = flippedCardIds;

		let matchFound = false;
		let shouldSwitchTurn = false;

		// Check for match
		if (game.cards[first].word === game.cards[second].word) {
			// Match found - mark cards as matched
			game.cards[first].isMatched = true;
			game.cards[second].isMatched = true;
			matchFound = true;

			// Update player score
			const player = game.players.find((p) => p.id === userId);
			if (player) {
				player.score++;
			}

			// Check if game is complete
			const allMatched = game.cards.every((c) => c.isMatched);
			if (allMatched) {
				game.status = "completed";
			}

			// Keep turn with current player
		} else {
			// No match - switch turn
			shouldSwitchTurn = true;
			const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentTurn);
			const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
			game.currentTurn = game.players[nextPlayerIndex].id;
		}

		game.cards.forEach((c) => {
			if (!c.isMatched) {
				c.isFlipped = false;
			}
		});

		// Broadcast match result
		await pusher.trigger(`memory-match-${gameId}`, "match-result", {
			matchFound,
			shouldSwitchTurn,
			game,
			firstCardId: first,
			secondCardId: second,
		});
	}

	return new Response(JSON.stringify({ success: true, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
