"use client";

import {
	Card,
	FinalScores,
	GameError,
	GameStatusBar,
	LoadingGame,
	WaitingScreen,
} from "@/components/games/memory-match";
import { useCardClickHandler, useJoinOrFetchGame, useSetUpPusherClient } from "@/hooks/games/memory-match";
import { useGamerStore } from "@/store/gamer";
import { useMemoryMatchGameStore } from "@/store/games/memory-match";
import Link from "next/link";
import { useEffect } from "react";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";

export default function MemoryMatchMainPage() {
	const gamer = useGamerStore((s) => s.gamer);
	const fetchGamer = useGamerStore((s) => s.fetchGamer);
	const { gameRoom, isMyTurn, isProcessing, isWon, error } = useMemoryMatchGameStore();

	useEffect(() => {
		fetchGamer();
	}, [fetchGamer]);

	useJoinOrFetchGame();
	useSetUpPusherClient();
	const handleCardClick = useCardClickHandler();

	if (!gameRoom) return <LoadingGame error={error} />;

	if (gameRoom.status === "waiting") return <WaitingScreen gameRoom={gameRoom} />;

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-900 to-indigo-950 py-6 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-2xl mx-auto'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<Link
						href='/games'
						className='inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors'
					>
						<FiArrowLeft className='w-4 h-4' />
						Games
					</Link>
					<h1 className='text-xl font-bold text-white'>Memory Match</h1>
					<div className='w-16' />
				</div>

				<GameStatusBar
					gameRoom={gameRoom}
					gamer={gamer!}
					isMyTurn={isMyTurn}
					isWon={isWon}
				/>

				<GameError message={error} />

				{/* Card Grid */}
				<div
					className='grid grid-cols-4 gap-2 sm:gap-3'
					style={{ perspective: "1000px" }}
				>
					{gameRoom.cards.map((card) => (
						<Card
							key={card.id}
							card={card}
							isMyTurn={isMyTurn}
							isProcessing={isProcessing}
							handleCardClick={handleCardClick}
						/>
					))}
				</div>

				{/* Game Complete */}
				{isWon && (
					<div className='mt-8 text-center p-6 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 animate-in fade-in zoom-in duration-300'>
						<h2 className='text-2xl font-bold text-white mb-2'>Game Complete!</h2>
						<p className='text-sm text-slate-400 mb-4'>Total moves: {gameRoom.moves}</p>

						<FinalScores
							players={gameRoom.players}
							gamer={gamer!}
						/>

						<div className='flex gap-3 justify-center mt-4'>
							<Link
								href='/games'
								className='inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-600 transition-colors'
							>
								<FiArrowLeft className='w-4 h-4' />
								Back to Games
							</Link>
							<Link
								href='/games/memory-match/new-game'
								className='inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20'
							>
								<FiRefreshCw className='w-4 h-4' />
								Play Again
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
