import { getPlayerStats } from "@/lib/game-store";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const player1Id = url.searchParams.get("player1Id");
	const player2Id = url.searchParams.get("player2Id");

	if (!player1Id || !player2Id) {
		return Response.json(
			{ error: "Both player1Id and player2Id are required" },
			{ status: 400 }
		);
	}

	const stats = await getPlayerStats(player1Id, player2Id);

	return Response.json({ stats }, { status: 200 });
}
