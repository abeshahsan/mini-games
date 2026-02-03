import { createGame } from "@/src/lib/game-store";
import { generateCards } from "../../memory-match/generate-cards/route";
import { cookies } from "next/headers";

export async function POST() {
	const gameId = crypto.randomUUID();
	
	// Get host user info from cookies
	const cookieStore = await cookies();
	const userId = cookieStore.get("uid")?.value || crypto.randomUUID();
	const username = cookieStore.get("username")?.value || "Player";
	
	// Generate cards for this game
	const cards = generateCards();
	
	// Create game in store
	const game = createGame(gameId, userId, username, cards);

	return new Response(JSON.stringify({ gameId, game }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
