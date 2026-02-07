export interface MemoryMatchPlayer {
	id: string;
	username: string;
	score: number;
}

export interface MemoryMatchCard {
	id: number;
	word: string;
	isFlipped: boolean;
	isMatched: boolean;
}

export interface MemoryMatchGameRoom {
	gameId: string;
	cards: Array<MemoryMatchCard>;
	players: MemoryMatchPlayer[];
	currentTurn: string; // player ID
	status: "waiting" | "in-progress" | "completed";
	moves: number;
	hostId: string;
	createdAt: number;
}