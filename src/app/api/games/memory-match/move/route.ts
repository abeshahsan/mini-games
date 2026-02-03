import { pusher } from "@/src/lib/pusher";
import { getGame, updateGame } from "@/src/lib/game-store";

export async function POST(request: Request) {
	const { gameId, cardId, userId } = await request.json();
	
	// Get current game state
	const game = getGame(gameId);
	
	if (!game) {
		return new Response(
			JSON.stringify({ error: "Game not found" }), 
			{ status: 404, headers: { "Content-Type": "application/json" } }
		);
	}
	
	// Validate game is in progress
	if (game.status !== "in-progress") {
		return new Response(
			JSON.stringify({ error: "Game is not in progress" }), 
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
	
	// Validate it's the player's turn
	if (game.currentTurn !== userId) {
		return new Response(
			JSON.stringify({ error: "Not your turn" }), 
			{ status: 403, headers: { "Content-Type": "application/json" } }
		);
	}
	
	// Validate card can be flipped
	const card = game.cards[cardId];
	if (!card || card.isFlipped || card.isMatched) {
		return new Response(
			JSON.stringify({ error: "Invalid move" }), 
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
	
	// Validate not too many cards flipped
	if (game.flippedCards.length >= 2) {
		return new Response(
			JSON.stringify({ error: "Too many cards flipped" }), 
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
	
	// Flip the card
	game.cards[cardId].isFlipped = true;
	game.flippedCards.push(cardId);
	
	// Check if we need to evaluate a match
	let shouldSwitchTurn = false;
	let matchFound = false;
	
	if (game.flippedCards.length === 2) {
		game.moves++;
		const [first, second] = game.flippedCards;
		
		// Check for match
		if (game.cards[first].word === game.cards[second].word) {
			// Match found - keep the turn with the same player
			game.cards[first].isMatched = true;
			game.cards[second].isMatched = true;
			matchFound = true;
			
			// Update player score
			const player = game.players.find(p => p.id === userId);
			if (player) {
				player.score++;
			}
			
			// Check if game is complete
			const allMatched = game.cards.every(c => c.isMatched);
			if (allMatched) {
				game.status = "completed";
			}
		} else {
			// No match - switch turn
			shouldSwitchTurn = true;
		}
		
		game.flippedCards = [];
	}
	
	// Switch turn if needed
	if (shouldSwitchTurn) {
		const currentPlayerIndex = game.players.findIndex(p => p.id === game.currentTurn);
		const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
		game.currentTurn = game.players[nextPlayerIndex].id;
	}
	
	// Update game state
	updateGame(gameId, game);
	
	// Broadcast move to all players
	await pusher.trigger(`memory-match-${gameId}`, "player-move", {
		cardId,
		userId,
		game,
		matchFound,
		shouldSwitchTurn,
	});
	
	return new Response(JSON.stringify({ success: true, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
