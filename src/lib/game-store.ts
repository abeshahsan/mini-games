import { MemoryMatchGameRoom } from "@/src/types";

// In-memory game store for multiplayer state
// In production, this should be replaced with a database like Redis

// Use global to persist store across hot reloads in development
const globalForGameStore = globalThis as unknown as {
	gameStore: Map<string, MemoryMatchGameRoom> | undefined;
};

const gameStore = globalForGameStore.gameStore ?? new Map<string, MemoryMatchGameRoom>();

// Preserve the store across hot reloads
if (process.env.NODE_ENV !== "production") {
	globalForGameStore.gameStore = gameStore;
}

export function createGame(gameId: string, hostId: string, hostUsername: string, cards: any[]): MemoryMatchGameRoom {
	console.log("[Game Store] Creating game:", gameId);
	const game: MemoryMatchGameRoom = {
		gameId,
		cards,
		players: [{ id: hostId, username: hostUsername, score: 0 }],
		currentTurn: hostId,
		status: "waiting",
		moves: 0,
		flippedCards: [],
		hostId,
		createdAt: Date.now(),
	};
	
	gameStore.set(gameId, game);
	console.log("[Game Store] Game created. Store size:", gameStore.size);
	return game;
}

export function getGame(gameId: string): MemoryMatchGameRoom | undefined {
	const game = gameStore.get(gameId);
	console.log("[Game Store] Get game:", gameId, "Found:", game ? "Yes" : "No", "Store size:", gameStore.size);
	return game;
}

export function updateGame(gameId: string, updates: Partial<MemoryMatchGameRoom>): MemoryMatchGameRoom | null {
	const game = gameStore.get(gameId);
	if (!game) return null;
	
	const updatedGame = { ...game, ...updates };
	gameStore.set(gameId, updatedGame);
	return updatedGame;
}

export function joinGame(gameId: string, playerId: string, playerUsername: string): MemoryMatchGameRoom | null {
	const game = gameStore.get(gameId);
	if (!game) return null;
	
	// Check if already in game
	if (game.players.find(p => p.id === playerId)) {
		return game;
	}
	
	// Only allow 2 players
	if (game.players.length >= 2) {
		return null;
	}
	
	game.players.push({ id: playerId, username: playerUsername, score: 0 });
	
	// Start game when second player joins
	if (game.players.length === 2) {
		game.status = "in-progress";
	}
	
	gameStore.set(gameId, game);
	return game;
}

export function deleteGame(gameId: string): void {
	gameStore.delete(gameId);
}

// Clean up old games (older than 1 hour)
export function cleanupOldGames(): void {
	const oneHourAgo = Date.now() - 60 * 60 * 1000;
	for (const [gameId, game] of gameStore.entries()) {
		if (game.createdAt < oneHourAgo) {
			gameStore.delete(gameId);
		}
	}
}

// Run cleanup every 10 minutes
setInterval(cleanupOldGames, 10 * 60 * 1000);
