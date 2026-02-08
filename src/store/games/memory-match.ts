import { MemoryMatchCard, MemoryMatchGameRoom } from "@/types";
import { create } from "zustand";

interface MemoryMatchGameState {
	// Game room state
	gameRoom: MemoryMatchGameRoom | null;
	isMyTurn: boolean;
	isProcessing: boolean;
	isWon: boolean;
	error: string | null;

	// Game room actions
	setGameRoom: (gameRoom: MemoryMatchGameRoom | null) => void;
	setIsMyTurn: (isMyTurn: boolean) => void;
	setIsProcessing: (isProcessing: boolean) => void;
	setIsWon: (isWon: boolean) => void;
	setError: (error: string | null) => void;
	resetGame: () => void;

	// Card-level helpers (kept from original)
	cards: MemoryMatchCard[] | null;
	updateCards: (updatedCards: MemoryMatchCard[]) => void;
	sendMove: (cardId: number, gameId: string, userId: string) => Promise<void>;
}

export const useMemoryMatchGameStore = create<MemoryMatchGameState>((set) => ({
	// Game room state
	gameRoom: null,
	isMyTurn: false,
	isProcessing: false,
	isWon: false,
	error: null,

	// Game room actions
	setGameRoom: (gameRoom) => set({ gameRoom, cards: gameRoom?.cards ?? null }),
	setIsMyTurn: (isMyTurn) => set({ isMyTurn }),
	setIsProcessing: (isProcessing) => set({ isProcessing }),
	setIsWon: (isWon) => set({ isWon }),
	setError: (error) => set({ error }),
	resetGame: () =>
		set({
			gameRoom: null,
			isMyTurn: false,
			isProcessing: false,
			isWon: false,
			error: null,
			cards: null,
		}),

	// Card-level helpers (kept from original)
	cards: null,
	updateCards: (updatedCards) => set({ cards: updatedCards }),
	sendMove: async (cardId, gameId, userId) => {
		try {
			const response = await fetch("/api/games/memory-match/move", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cardId, gameId, userId }),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (e) {
			console.error("Error in sendMove:", e);
			set({ error: "Failed to make move" });
			setTimeout(() => set({ error: null }), 2000);
		}
	},
}));
