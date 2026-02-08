import { useGamerStore } from "@/store/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { MemoryMatchGameRoom } from "@/types";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export function useJoinOrFetchGame() {
	const params = useParams();
	const gameId = params.gameId as string;
	const gamer = useGamerStore((s) => s.gamer);
	const { setGameRoom, setIsMyTurn, setIsWon, setError } = useMemoryMatchGameStore();

	useEffect(() => {
		if (!gamer) return;

		async function joinOrFetchGame() {
			try {
				// Try to join the game via POST
				let joinResponse = await fetch("/api/games/memory-match/join-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ gameId }),
				});

				// If POST fails, try GET as fallback
				if (!joinResponse.ok) {
					console.warn("POST join-game failed, trying GET fallback");
					joinResponse = await fetch(`/api/games/memory-match/join-game?gameId=${gameId}`, {
						method: "GET",
					});
				}

				if (!joinResponse.ok) {
					throw new Error("Failed to join game");
				}

				const { game }: { game: MemoryMatchGameRoom } = await joinResponse.json();

				if (!game) {
					throw new Error("No game data received");
				}

				setGameRoom(game);
				setIsMyTurn(game.currentTurn === gamer?.id);

				if (game.status === "completed") {
					setIsWon(true);
				}
			} catch (err) {
				console.error("Error joining or fetching game:", err);
				setError("Failed to join game. Game may not exist or is full.");
			}
		}

		joinOrFetchGame();
	}, [gamer, gameId, setGameRoom, setIsMyTurn, setIsWon, setError]);
}
