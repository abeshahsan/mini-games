"use client";

import { Card } from "@/components/games/memory-match/card";
import { GameError } from "@/components/games/memory-match/error";
import { FinalScores } from "@/components/games/memory-match/final-scores";
import { LoadingGame } from "@/components/games/memory-match/loading-game";
import { GameStatusBar } from "@/components/games/memory-match/score-board";
import { WaitingScreen } from "@/components/games/memory-match/waiting-screen";
import { useCardClickHandler, useJoinOrFetchGame, useSetUpPusherClient } from "@/hooks/games/memory-match";
import { Gamer, MemoryMatchGameRoom } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MemoryMatchPage() {
	const [gameRoom, setGameRoom] = useState<MemoryMatchGameRoom | null>(null);
	const [isWon, setIsWon] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [gamer, setGamer] = useState<Gamer | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isMyTurn, setIsMyTurn] = useState(false);

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

	useJoinOrFetchGame({ gamer, setGameRoom, setIsMyTurn, setIsWon, setError });

	const handleCardClick = useCardClickHandler({ gamer, gameRoom, setError, isProcessing });

	useSetUpPusherClient({ gamer, setGameRoom, setIsMyTurn, setIsWon, setIsProcessing });

	if (!gameRoom) {
		return <LoadingGame error={error} />;
	}

	if (gameRoom.status === "waiting") {
		return <WaitingScreen gameRoom={gameRoom} />;
	}

	// main game screen
	// render if gameRoom is loaded and status is in-progress or completed
	return (
		<div className='min-h-screen bg-linear-to-br from-purple-50 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				<div className='text-center mb-4'>
					<h1 className='text-3xl font-extrabold text-slate-900 dark:text-white'>Memory Match</h1>
					<p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>Match the pairs of words!</p>
				</div>

				<GameStatusBar
					gameRoom={gameRoom}
					gamer={gamer!}
					isMyTurn={isMyTurn}
					isWon={isWon}
				/>

				<GameError message={error} />

				<div className='grid grid-cols-4 gap-2 sm:gap-4'>
					{gameRoom.cards.map((card) => (
						<Card
							isMyTurn={isMyTurn}
							isProcessing={isProcessing}
							key={card.id}
							card={card}
							handleCardClick={handleCardClick}
						/>
					))}
				</div>

				{isWon && (
					<div className='mt-8 text-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-green-500 animate-in fade-in zoom-in duration-300'>
						<h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Game Complete! </h2>
						<p className='text-sm text-slate-600 dark:text-slate-400 mb-4'>Total moves: {gameRoom.moves}</p>

						<FinalScores
							players={gameRoom.players}
							gamer={gamer!}
						/>

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
