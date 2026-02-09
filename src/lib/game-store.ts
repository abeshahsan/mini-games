import { MemoryMatchGameRoom, PlayerStats } from "@/types";
import { redisInstance } from "./redis";

// Redis-backed game store for multiplayer state
// Games are stored with key pattern: game:memory-match:{gameId}
// Player stats are stored with key pattern: player-stats:{player1Id}:{player2Id}
// TTL is set to 2 hours for automatic cleanup

const GAME_KEY_PREFIX = "game:memory-match:";
const STATS_KEY_PREFIX = "player-stats:";
const GAME_TTL = 60 * 60 * 2; // 2 hours in seconds
const STATS_TTL = 60 * 60 * 8; // 8 hours for stats (longer than games)

function getGameKey(gameId: string): string {
	return `${GAME_KEY_PREFIX}${gameId}`;
}

export async function createGame(gameId: string, hostId: string, hostUsername: string, cards: any[]): Promise<MemoryMatchGameRoom> {
	console.log("[Game Store] Creating game:", gameId);
	const game: MemoryMatchGameRoom = {
		gameId,
		cards,
		players: [{ id: hostId, username: hostUsername, score: 0 }],
		currentTurn: hostId,
		status: "waiting",
		moves: 0,
		hostId,
		createdAt: Date.now(),
	};
	
	const key = getGameKey(gameId);
	await redisInstance.set(key, JSON.stringify(game), "EX", GAME_TTL);
	console.log("[Game Store] Game created and saved to Redis:", gameId);
	return game;
}

export async function getGame(gameId: string): Promise<MemoryMatchGameRoom | null> {
	const key = getGameKey(gameId);
	const data = await redisInstance.get(key);
	
	if (!data) {
		console.log("[Game Store] Get game:", gameId, "Found: No");
		return null;
	}
	
	const game = JSON.parse(data as string) as MemoryMatchGameRoom;
	console.log("[Game Store] Get game:", gameId, "Found: Yes");
	return game;
}

export async function updateGame(gameId: string, updates: Partial<MemoryMatchGameRoom>): Promise<MemoryMatchGameRoom | null> {
	const game = await getGame(gameId);
	if (!game) return null;
	
	const updatedGame = { ...game, ...updates };
	const key = getGameKey(gameId);
	await redisInstance.set(key, JSON.stringify(updatedGame), "EX", GAME_TTL);
	console.log("[Game Store] Game updated in Redis:", gameId);
	return updatedGame;
}

export async function joinGame(gameId: string, playerId: string, playerUsername: string): Promise<MemoryMatchGameRoom | null> {
	const game = await getGame(gameId);
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
	
	const key = getGameKey(gameId);
	await redisInstance.set(key, JSON.stringify(game), "EX", GAME_TTL);
	console.log("[Game Store] Player joined and game updated in Redis:", gameId);
	return game;
}

export async function deleteGame(gameId: string): Promise<void> {
	const key = getGameKey(gameId);
	await redisInstance.del(key);
	console.log("[Game Store] Game deleted from Redis:", gameId);
}

// Clean up old games (older than 2 hours) - Redis TTL handles this automatically
// This function is kept for manual cleanup if needed
export async function cleanupOldGames(): Promise<void> {
	const twoHoursAgo = Date.now() - GAME_TTL * 1000;
	
	// Scan for all game keys
	let cursor = "0";
	do {
		const result = await redisInstance.scan(cursor, "MATCH", `${GAME_KEY_PREFIX}*`, "COUNT", 100);
		cursor = result[0] as string;
		const keys = result[1] as string[];
		
		for (const key of keys) {
			const data = await redisInstance.get(key);
			if (data) {
				const game = JSON.parse(data as string) as MemoryMatchGameRoom;
				if (game.createdAt < twoHoursAgo) {
					await redisInstance.del(key);
					console.log("[Game Store] Cleaned up old game:", game.gameId);
				}
			}
		}
	} while (cursor !== "0");
}

// Run cleanup every 30 minutes (Redis TTL is primary cleanup mechanism)
setInterval(cleanupOldGames, 30 * 60 * 1000);

// ═══════════════════════════════════════════════════════════════
// Player Stats Management
// ═══════════════════════════════════════════════════════════════

function getStatsKey(player1Id: string, player2Id: string): string {
	// Sort IDs to ensure consistent key regardless of order
	const [p1, p2] = [player1Id, player2Id].sort();
	return `${STATS_KEY_PREFIX}${p1}:${p2}`;
}

export async function getPlayerStats(player1Id: string, player2Id: string): Promise<PlayerStats> {
	const key = getStatsKey(player1Id, player2Id);
	const data = await redisInstance.get(key);
	
	if (!data) {
		// Return default stats if none exist
		return { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 };
	}
	
	return JSON.parse(data as string) as PlayerStats;
}

export async function updatePlayerStats(
	winnerId: string | null,
	player1Id: string,
	player2Id: string
): Promise<void> {
	const key = getStatsKey(player1Id, player2Id);
	const stats = await getPlayerStats(player1Id, player2Id);
	
	stats.gamesPlayed++;
	
	if (winnerId === null) {
		// Draw
		stats.draws++;
	} else {
		// Note: wins/losses are from player1's perspective
		const [sortedP1] = [player1Id, player2Id].sort();
		if (winnerId === sortedP1) {
			stats.wins++;
		} else {
			stats.losses++;
		}
	}
	
	await redisInstance.set(key, JSON.stringify(stats), "EX", STATS_TTL);
	console.log("[Game Store] Player stats updated:", key, stats);
}
