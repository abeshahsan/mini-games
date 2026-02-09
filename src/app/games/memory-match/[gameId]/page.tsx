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
		<div
			className='min-h-screen bg-bg-primary py-6 px-4 sm:px-6 lg:px-8'
			style={{
				backgroundImage: "url(/assets/ui/game-bg-tile-400.png)",
				backgroundSize: "400px 400px",
				backgroundRepeat: "repeat",
			}}
		>
			<div className='max-w-2xl mx-auto'>
				{/* Header */}
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center gap-2'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src='/assets/logos/logo-icon-only-64.png'
							alt=''
							className='w-7 h-7 rounded-md'
						/>
						<h1 className='text-xl font-bold text-text-primary'>Memory Match</h1>
					</div>
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
					<div className='mt-8 text-center p-6 bg-surface backdrop-blur-sm rounded-2xl border border-surface-border animate-in fade-in zoom-in duration-300' style={{ boxShadow: "var(--shadow-xl)" }}>
						{/* Champion medal */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src='/assets/ui/medals/medal-champion-128.png'
							alt='Game Complete'
							className='w-16 h-16 mx-auto mb-3'
						/>
						<h2 className='text-2xl font-bold text-text-primary mb-2'>Game Complete!</h2>
						<p className='text-sm text-text-secondary mb-4'>Total moves: {gameRoom.moves}</p>

						<FinalScores
							players={gameRoom.players}
							gamer={gamer!}
						/>

						<div className='flex gap-3 justify-center mt-4'>
							<Link
								href='/games'
								className='inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-surface-active text-text-secondary text-sm font-semibold hover:bg-surface-hover transition-colors'
							>
								<FiArrowLeft className='w-4 h-4' />
								Back to Games
							</Link>
							<Link
								href='/games/memory-match/new-game'
								className='inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand text-text-inverse text-sm font-semibold hover:bg-brand-hover transition-colors'
								style={{ boxShadow: "var(--shadow-brand)" }}
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
