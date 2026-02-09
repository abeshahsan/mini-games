export interface MemoryMatchPlayer {
	id: string;
	username: string;
	score: number;
}

export interface MemoryMatchCard {
	id: number;
	word: string; // slug used for match comparison (e.g. "apple")
	image: string; // URL to the card face image
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

export interface PlayerStats {
	wins: number;
	losses: number;
	draws: number;
	gamesPlayed: number;
}

export interface PlayerMatchup {
	player1Id: string;
	player2Id: string;
}
