import { useGamerStore } from "@/store/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { useParams } from "next/navigation";

export function useCardClickHandler() {
	const params = useParams();
	const gameId = params.gameId as string;
	const gamer = useGamerStore((s) => s.gamer);
	const { gameRoom, isProcessing, setError, sendMove } = useMemoryMatchGameStore();

	const handleCardClick = (id: number) => {
		if (!gamer || !gameRoom) return;

		if (gameRoom.currentTurn !== gamer.id) {
			setError("It's not your turn!");
			setTimeout(() => setError(null), 2000);
			return;
		}

		if (gameRoom.status !== "in-progress") {
			setError("Game is not in progress");
			setTimeout(() => setError(null), 2000);
			return;
		}

		const card = gameRoom.cards[id];
		if (card.isFlipped || card.isMatched || isProcessing) {
			return;
		}

		sendMove(id, gameId, gamer.id);
	};

	return handleCardClick;
}
