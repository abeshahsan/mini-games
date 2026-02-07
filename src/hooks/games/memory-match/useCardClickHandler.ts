// = (id: number) => {
// 		if (!gamer || !gameRoom) return;

// 		// Check if it's player's turn
// 		if (gameRoom.currentTurn !== gamer.id) {
// 			setError("It's not your turn!");
// 			setTimeout(() => setError(null), 2000);
// 			return;
// 		}

// 		// Check if game is in progress
// 		if (gameRoom.status !== "in-progress") {
// 			setError("Game is not in progress");
// 			setTimeout(() => setError(null), 2000);
// 			return;
// 		}

// 		// Check if card can be flipped
// 		const card = gameRoom.cards[id];
// 		if (card.isFlipped || card.isMatched || isProcessing) {
// 			return;
// 		}

// 		fetch("/api/games/memory-match/move", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				gameId,
// 				cardId: id,
// 				userId: gamer.id,
// 			}),
// 		}).catch((err) => {
// 			console.error("Failed to make move:", err);
// 			setError("Failed to make move");
// 			setTimeout(() => setError(null), 2000);
// 		});
// 	};

/// return a function from here that can be used in the page component to handle card clicks, so that the logic is separated and can be reused if needed

import { Gamer, MemoryMatchGameRoom } from "@/types";
import { useParams } from "next/navigation";

type UseCardClickHandlerProps = {
	gamer: Gamer | null;
	gameRoom: MemoryMatchGameRoom | null;
	setError: React.Dispatch<React.SetStateAction<string | null>>;
	isProcessing: boolean;
};

export function useCardClickHandler({ gamer, gameRoom, setError, isProcessing }: UseCardClickHandlerProps) {
	const params = useParams();
	const gameId = params.gameId as string;

	const handleCardClick = (id: number) => {
		if (!gamer || !gameRoom) return;

		// Check if it's player's turn
		if (gameRoom.currentTurn !== gamer.id) {
			setError("It's not your turn!");
			setTimeout(() => setError(null), 2000);
			return;
		}

		// Check if game is in progress
		if (gameRoom.status !== "in-progress") {
			setError("Game is not in progress");
			setTimeout(() => setError(null), 2000);
			return;
		}

		// Check if card can be flipped
		const card = gameRoom.cards[id];
		if (card.isFlipped || card.isMatched || isProcessing) {
			return;
		}

		fetch("/api/games/memory-match/move", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				gameId,
				cardId: id,
				userId: gamer.id,
			}),
		}).catch((err) => {
			console.error("Failed to make move:", err);
			setError("Failed to make move");
			setTimeout(() => setError(null), 2000);
		});
	};

	return handleCardClick;
}
