import { MemoryMatchGameRoom, MemoryMatchPlayer } from "@/types";
import { useParams } from "next/navigation";
import Pusher, { Channel } from "pusher-js";
import { useEffect, useState } from "react";

type useSetUpPusherClientParams = {
	gamer: { id: string; ign: string } | null;
	setGameRoom: React.Dispatch<React.SetStateAction<MemoryMatchGameRoom | null>>;
	setIsMyTurn: React.Dispatch<React.SetStateAction<boolean>>;
	setIsWon: React.Dispatch<React.SetStateAction<boolean>>;
	setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useSetUpPusherClient({
	gamer,
	setGameRoom,
	setIsMyTurn,
	setIsWon,
	setIsProcessing,
}: useSetUpPusherClientParams) {
	const params = useParams();
	const gameId = params.gameId as string;
	const [pusher, setPusher] = useState<Pusher | null>(null);
	const [channel, setChannel] = useState<Channel | null>(null);

	useEffect(() => {
		async function setupPusher() {
			if (!gamer) return;

			const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
				cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
				forceTLS: true,
			});

			const pusherChannel = pusherClient.subscribe(`memory-match-${gameId}`);

			setPusher(pusherClient);
			setChannel(pusherChannel);

			pusherChannel.bind("pusher:subscription_succeeded", () => {
				console.log("[Pusher] Successfully subscribed to channel:", `memory-match-${gameId}`);
			});

			pusherChannel.bind("pusher:subscription_error", (error: any) => {
				console.error("[Pusher] Subscription error:", error);
			});

			// Player joined event
			pusherChannel.bind("player-joined", (data: { player: MemoryMatchPlayer; game: MemoryMatchGameRoom }) => {
				console.log("[Pusher] Player joined:", data);
				setGameRoom(data.game);
			});

			// Game started event
			pusherChannel.bind("game-started", (data: { game: MemoryMatchGameRoom }) => {
				console.log("[Pusher] Game started:", data);
				setGameRoom(data.game);
			});

			// Card flipped event - update immediately
			pusherChannel.bind(
				"card-flipped",
				(data: { cardId: number; userId: string; game: MemoryMatchGameRoom }) => {
					console.log("[Pusher] Card flipped:", data.cardId, "by user:", data.userId);

					const allFlilppedCards = data.game.cards.filter((c) => c.isFlipped);
					console.log("[Pusher] Total flipped cards now:", allFlilppedCards);

					// Update game state
					setGameRoom(data.game);
				},
			);

			// Match result event - handle after both cards are flipped
			pusherChannel.bind(
				"match-result",
				async (data: {
					matchFound: boolean;
					shouldSwitchTurn: boolean;
					game: MemoryMatchGameRoom;
					firstCardId: number;
					secondCardId: number;
				}) => {
					console.log("[Pusher] Match result:", {
						matchFound: data.matchFound,
						firstCard: data.firstCardId,
						secondCard: data.secondCardId,
					});

					const { game, matchFound } = data;

					// setGameRoom(game);

					setIsMyTurn(game.currentTurn === gamer?.id);
					setIsProcessing(true);

					if (matchFound) {
						// Match found - cards stay flipped and matched
						setTimeout(() => {
							setIsProcessing(false);

							// Check if game is complete
							if (game.status === "completed") {
								setIsWon(true);
							}
						}, 500);
					} else {
						// No match - flip cards back after delay
						setTimeout(() => {
							setGameRoom((prevGame) => {
								if (!prevGame) return prevGame;
								const updatedCards = [...prevGame.cards];
								updatedCards[data.firstCardId].isFlipped = false;
								updatedCards[data.secondCardId].isFlipped = false;
								return { ...prevGame, cards: updatedCards, currentTurn: game.currentTurn };
							});
							setIsProcessing(false);
						}, 1000);
					}
				},
			);

			return () => {
				pusherClient.unsubscribe(`memory-match-${gameId}`);
				pusherClient.disconnect();
				setPusher(null);
				setChannel(null);
			};
		}

		setupPusher();
	}, [gameId, gamer, setGameRoom, setIsMyTurn, setIsProcessing, setIsWon]);

	return { pusher, channel };
}
