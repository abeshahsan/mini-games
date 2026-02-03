import { joinGame, getGame } from "@/src/lib/game-store";
import { pusher } from "@/src/lib/pusher";
import { cookies } from "next/headers";

export async function POST(request: Request) {
	const { gameId } = await request.json();
	
	// Get player info from cookies
	const cookieStore = await cookies();
	const userId = cookieStore.get("uid")?.value || crypto.randomUUID();
	const username = cookieStore.get("username")?.value || "Player";
	
	// Try to join the game
	const game = joinGame(gameId, userId, username);
	
	if (!game) {
		return new Response(
			JSON.stringify({ error: "Game not found or full" }), 
			{ status: 404, headers: { "Content-Type": "application/json" } }
		);
	}
	
	// Notify all players in the room about the new player
	await pusher.trigger(`memory-match-${gameId}`, "player-joined", {
		player: { id: userId, username },
		game,
	});
	
	// If game just started (second player joined), notify everyone
	if (game.status === "in-progress" && game.players.length === 2) {
		await pusher.trigger(`memory-match-${gameId}`, "game-started", {
			game,
		});
	}
	
	return new Response(JSON.stringify({ success: true, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const gameId = url.searchParams.get("gameId");
	
	if (!gameId) {
		return new Response(
			JSON.stringify({ error: "Game ID required" }), 
			{ status: 400, headers: { "Content-Type": "application/json" } }
		);
	}
	
	const game = getGame(gameId);
	
	if (!game) {
		return new Response(
			JSON.stringify({ error: "Game not found" }), 
			{ status: 404, headers: { "Content-Type": "application/json" } }
		);
	}
	
	return new Response(JSON.stringify({ game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
