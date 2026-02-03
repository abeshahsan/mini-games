"use client";

import { Card } from "@/src/app/games/types";
import { Gamer, MemoryMatchGameRoom, Player } from "@/src/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useParams } from "next/navigation";

export default function MemoryMatchPage() {
	const params = useParams();
	const gameId = params.gameId as string;

	const [gameRoom, setGameRoom] = useState<MemoryMatchGameRoom | null>(null);
	const [cards, setCards] = useState<Card[]>([]);
	const [flippedCards, setFlippedCards] = useState<number[]>([]);
	const [moves, setMoves] = useState(0);
	const [isWon, setIsWon] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [gamer, setGamer] = useState<Gamer | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isMyTurn, setIsMyTurn] = useState(false);

	const stateRef = useRef({ cards, flippedCards, isProcessing, isWon, gameRoom });
	useEffect(() => {
		stateRef.current = { cards, flippedCards, isProcessing, isWon, gameRoom };
	});

	// Fetch current user
	useEffect(() => {
		async function fetchUser() {
			try {
				const {
					uid,
					username,
				}: {
					uid: string;
					username: string;
				} = await fetch("/api/me", { method: "GET" }).then((res) => res.json());

				setGamer({ id: uid, ign: username });
			} catch (err) {
				console.error("Failed to fetch user info:", err);
				setError("Failed to fetch user info");
			}
		}

		fetchUser();
	}, []);

	// Join or fetch game state
	useEffect(() => {
		if (!gamer) return;

		async function joinOrFetchGame() {
			try {
				// Try to join the game via POST
				let joinResponse = await fetch("/api/games/memory-match/join-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ gameId }),
				});

				// If POST fails, try GET as fallback
				if (!joinResponse.ok) {
					console.warn("POST join-game failed, trying GET fallback");
					joinResponse = await fetch(`/api/games/memory-match/join-game?gameId=${gameId}`, {
						method: "GET",
					});
				}

				if (!joinResponse.ok) {
					throw new Error("Failed to join game");
				}

				const { game } = await joinResponse.json();
				
				if (!game) {
					throw new Error("No game data received");
				}
				
				setGameRoom(game);
				setCards(game.cards);
				setMoves(game.moves);
				setIsMyTurn(game.currentTurn === gamer?.id);

				if (game.status === "completed") {
					setIsWon(true);
				}
			} catch (err) {
				console.error("Error joining or fetching game:", err);
				setError("Failed to join game. Game may not exist or is full.");
			}
		}

		joinOrFetchGame();
	}, [gamer, gameId]);

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
		const card = cards[id];
		if (card.isFlipped || card.isMatched || isProcessing || flippedCards.length >= 2) {
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

	// Handle Pusher events
	useEffect(() => {
		const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
			cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
			forceTLS: true,
		});

		const channel = pusherClient.subscribe(`memory-match-${gameId}`);

		// Player joined event
		channel.bind("player-joined", (data: { player: Player; game: MemoryMatchGameRoom }) => {
			setGameRoom(data.game);
		});

		// Game started event
		channel.bind("game-started", (data: { game: MemoryMatchGameRoom }) => {
			setGameRoom(data.game);
			setCards(data.game.cards);
		});

		// Player move event
		channel.bind(
			"player-move",
			(data: {
				cardId: number;
				userId: string;
				game: MemoryMatchGameRoom;
				matchFound: boolean;
				shouldSwitchTurn: boolean;
			}) => {
				const { game, matchFound } = data;

				setGameRoom(game);
				setMoves(game.moves);
				setIsMyTurn(game.currentTurn === gamer?.id);

				// Update cards immediately for the flip
				setCards(game.cards);

				// Handle match or mismatch with delays
				if (game.flippedCards.length === 0) {
					setIsProcessing(true);

					if (matchFound) {
						// Match found - cards stay flipped and matched
						setTimeout(() => {
							setCards([...game.cards]);
							setIsProcessing(false);

							// Check if game is complete
							if (game.status === "completed") {
								setIsWon(true);
							}
						}, 500);
					} else {
						// No match - flip cards back after delay
						setTimeout(() => {
							setCards([...game.cards]);
							setIsProcessing(false);
						}, 1000);
					}
				}
			},
		);

		return () => {
			pusherClient.unsubscribe(`memory-match-${gameId}`);
			pusherClient.disconnect();
		};
	}, [gameId, gamer]);

	// Waiting for second player
	if (!gameRoom) {
		return (
			<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 flex items-center justify-center'>
				<div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl'>
					<div className='animate-pulse text-center'>
						<div className='h-12 w-12 mx-auto mb-4 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin'></div>
						<p className='text-lg font-semibold text-slate-700 dark:text-slate-300'>
							{error || "Loading game..."}
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (gameRoom.status === "waiting") {
		return (
			<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-8 px-4'>
				<div className='max-w-2xl mx-auto'>
					<div className='flex justify-between items-center mb-6'>
						<Link
							href='/games'
							className='flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'
						>
							<svg
								className='mr-2 h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M15 19l-7-7 7-7'
								/>
							</svg>
							Back to Games
						</Link>
					</div>

					<div className='bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl text-center'>
						<h1 className='text-3xl font-extrabold text-slate-900 dark:text-white mb-4'>
							Waiting for Player 2
						</h1>
						<div className='flex items-center justify-center gap-2 mb-6'>
							<div
								className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'
								style={{ animationDelay: "0ms" }}
							></div>
							<div
								className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'
								style={{ animationDelay: "150ms" }}
							></div>
							<div
								className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'
								style={{ animationDelay: "300ms" }}
							></div>
						</div>
						<p className='text-slate-600 dark:text-slate-400 mb-6'>
							Share this game link with a friend to start playing!
						</p>
						<div className='bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mb-6'>
							<code className='text-sm text-slate-800 dark:text-slate-200 break-all'>
								{typeof window !== "undefined" ? window.location.href : ""}
							</code>
						</div>
						<button
							onClick={() => {
								if (typeof window !== "undefined") {
									navigator.clipboard.writeText(window.location.href);
									alert("Link copied to clipboard!");
								}
							}}
							className='px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition-colors shadow-md'
						>
							Copy Link
						</button>

						<div className='mt-8 pt-8 border-t border-slate-200 dark:border-slate-700'>
							<h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-4'>Players</h3>
							<div className='space-y-2'>
								{gameRoom.players.map((player, index) => (
									<div
										key={player.id}
										className='flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg'
									>
										<span className='font-medium text-slate-700 dark:text-slate-300'>
											{player.username} {player.id === gameRoom.hostId && "(Host)"}
										</span>
										<span className='text-sm text-slate-500 dark:text-slate-400'>
											Player {index + 1}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				<div className='flex justify-between items-center mb-6'>
					<Link
						href='/games'
						className='flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500'
					>
						<svg
							className='mr-2 h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 19l-7-7 7-7'
							/>
						</svg>
						Back to Games
					</Link>
				</div>

				<div className='text-center mb-4'>
					<h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>Memory Match</h1>
					<p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>Match the pairs of words!</p>
				</div>

				{/* Game Status Bar */}
				<div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 mb-6'>
					<div className='flex justify-between items-center mb-3'>
						<div className='text-sm'>
							<span className='font-semibold text-slate-700 dark:text-slate-300'>Moves: </span>
							<span className='text-lg font-bold text-indigo-600 dark:text-indigo-400'>{moves}</span>
						</div>
						<div className='text-sm'>
							<span className='font-semibold text-slate-700 dark:text-slate-300'>Game ID: </span>
							<span className='text-xs font-mono text-slate-500 dark:text-slate-400'>
								{gameId.slice(0, 8)}...
							</span>
						</div>
					</div>

					{/* Players */}
					<div className='grid grid-cols-2 gap-3'>
						{gameRoom.players.map((player) => {
							const isCurrent = gameRoom.currentTurn === player.id;
							const isMe = gamer?.id === player.id;

							return (
								<div
									key={player.id}
									className={`p-3 rounded-lg transition-all ${
										isCurrent ?
											"bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500 shadow-lg"
										:	"bg-slate-100 dark:bg-slate-700/50 border-2 border-transparent"
									}`}
								>
									<div className='flex items-center justify-between'>
										<div>
											<p
												className={`font-semibold text-sm ${
													isCurrent ?
														"text-indigo-700 dark:text-indigo-300"
													:	"text-slate-700 dark:text-slate-300"
												}`}
											>
												{player.username} {isMe && "(You)"}
											</p>
											<p className='text-xs text-slate-500 dark:text-slate-400'>
												Score: {player.score}
											</p>
										</div>
										{isCurrent && (
											<div className='flex items-center gap-1'>
												<div className='h-2 w-2 bg-green-500 rounded-full animate-pulse'></div>
												<span className='text-xs font-semibold text-green-600 dark:text-green-400'>
													Turn
												</span>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>

					{/* Turn indicator */}
					{isMyTurn && !isWon && (
						<div className='mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center'>
							<p className='text-sm font-bold text-green-700 dark:text-green-400'>
								🎯 It&apos;s your turn!
							</p>
						</div>
					)}

					{!isMyTurn && !isWon && (
						<div className='mt-3 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-center'>
							<p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
								Waiting for opponent...
							</p>
						</div>
					)}
				</div>

				{/* Error message */}
				{error && (
					<div className='mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-lg text-center'>
						<p className='text-sm font-semibold text-red-700 dark:text-red-400'>{error}</p>
					</div>
				)}

				<div className='grid grid-cols-4 gap-2 sm:gap-4'>
					{cards.map((card) => (
						<div
							key={card.id}
							onClick={() => handleCardClick(card.id)}
							className={`
								relative aspect-square cursor-pointer transition-all duration-500 transform-3d
								${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
								${!isMyTurn || isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
							`}
						>
							{/* Card Front (Hidden) */}
							<div className='absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-indigo-100 dark:border-slate-700 flex items-center justify-center backface-hidden'>
								<span className='text-2xl font-bold text-indigo-200 dark:text-slate-700'>?</span>
							</div>

							{/* Card Back (Word) */}
							<div
								className={`
								absolute inset-0 rounded-lg shadow-lg flex items-center justify-center p-2 backface-hidden rotate-y-180
								${card.isMatched ? "bg-green-100 dark:bg-green-900/30 border-green-500 shadow-green-100/50" : "bg-white dark:bg-slate-700 border-indigo-400"}
								border-2
							`}
							>
								<span
									className={`
									font-bold text-center wrap-break-word
									${card.isMatched ? "text-green-700 dark:text-green-400" : "text-slate-900 dark:text-white"}
									${card.word.length > 8 ? "text-xs italic" : "text-sm sm:text-base"}
								`}
								>
									{card.word}
								</span>
							</div>
						</div>
					))}
				</div>

				{isWon && (
					<div className='mt-8 text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-green-500 animate-in fade-in zoom-in duration-300'>
						<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Game Complete! 🎉</h2>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>Total moves: {moves}</p>

						{/* Final scores */}
						<div className='mb-4 space-y-2'>
							{gameRoom.players
								.sort((a, b) => b.score - a.score)
								.map((player, index) => {
									const isMe = gamer?.id === player.id;
									const isWinner = index === 0;

									return (
										<div
											key={player.id}
											className={`p-3 rounded-lg ${
												isWinner ?
													"bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500"
												:	"bg-slate-100 dark:bg-slate-700/50"
											}`}
										>
											<div className='flex justify-between items-center'>
												<span className='font-semibold text-slate-700 dark:text-slate-300'>
													{isWinner && "🏆 "}
													{player.username} {isMe && "(You)"}
												</span>
												<span className='font-bold text-lg text-indigo-600 dark:text-indigo-400'>
													{player.score} {player.score === 1 ? "match" : "matches"}
												</span>
											</div>
										</div>
									);
								})}
						</div>

						<Link
							href='/games/memory-match/new-game'
							className='inline-block px-8 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg'
						>
							Play Again
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
