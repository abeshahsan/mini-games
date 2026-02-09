import { useGamerStore } from "@/store/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import { useParams } from "next/navigation";

export function useCardClickHandler() {
	const params = useParams();
	const gameId = params.gameId as string;
	const gamer = useGamerStore((s) => s.gamer);
	const {
		gameRoom,
		isProcessing,
		setError,
		setIsProcessing,
		sendMove,
		optimisticFlipCard,
		rollbackOptimisticFlip,
	} = useMemoryMatchGameStore();

	const handleCardClick = async (id: number) => {
		if (!gamer || !gameRoom) return;

		// Prevent clicks during processing (REQUIREMENT 4)
		if (isProcessing) {
			return;
		}

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
		if (card.isFlipped || card.isMatched) {
			return;
		}

		// Save previous state for potential rollback
		const previousState = { ...gameRoom };

		// Set processing flag to prevent double clicks (REQUIREMENT 4)
		setIsProcessing(true);

		// Optimistic update: flip card immediately for better UX (REQUIREMENT 3)
		optimisticFlipCard(id);

		// Send move to server
		const success = await sendMove(id, gameId, gamer.id);

		if (!success) {
			// Rollback on failure (REQUIREMENT 3)
			rollbackOptimisticFlip(previousState);
			setError("Failed to make move. Please try again.");
			setTimeout(() => setError(null), 3000);
		}

		// Note: Processing flag will be cleared by Pusher event
		// We keep it on for a minimum time to prevent rapid double-clicks
		setTimeout(() => setIsProcessing(false), 500);
	};

	return handleCardClick;
}
