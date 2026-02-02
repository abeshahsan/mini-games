export interface GameRegistryEntry {
	id: string;
	name: string;
	description: string;
	route: string;
	icon: string; // URL or path to the icon image
	iscomPleted?: boolean; // for devs purposes
}

export const GameRegistry: Record<string, GameRegistryEntry> = {
	ticTacToe: {
		id: "ticTacToe",
		name: "Tic Tac Toe",
		description: "A classic two-player game where players take turns marking Xs and Os on a 3x3 grid.",
		route: "/games/tic-tac-toe",
		icon: "/assets/icons/tic-tac-toe.png",
	},
	snake: {
		id: "snake",
		name: "Snake",
		description: "Control a growing snake to eat food while avoiding collisions with walls and itself.",
		route: "/games/snake",
		icon: "/assets/icons/snake.png",
	},
	memoryMatch: {
		id: "memoryMatch",
		name: "Memory Match",
		description: "Flip cards to find matching pairs in this memory challenge game.",
		route: "/games/memory-match",
		icon: "/assets/icons/memory-match.png",
		iscomPleted: true,
	},
};

export const getAllGames = (): GameRegistryEntry[] => {
	return Object.values(GameRegistry);
};
