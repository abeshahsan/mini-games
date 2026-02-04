export interface Gamer {
	id: string;
	ign: string;
}

export interface Player {
	id: string;
	username: string;
	score: number;
}

export interface MemoryMatchGameRoom {
	gameId: string;
	cards: Array<{
		id: number;
		word: string;
		isFlipped: boolean;
		isMatched: boolean;
	}>;
	players: Player[];
	currentTurn: string; // player ID
	status: "waiting" | "in-progress" | "completed";
	moves: number;
	hostId: string;
	createdAt: number;
}
