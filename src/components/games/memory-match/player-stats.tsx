"use client";

import { PlayerStats } from "@/types";
import { useEffect, useState } from "react";
import { FiAward, FiX, FiMinus } from "react-icons/fi";

interface PlayerStatsDisplayProps {
	player1Id: string;
	player2Id: string;
}

export function PlayerStatsDisplay({ player1Id, player2Id }: PlayerStatsDisplayProps) {
	const [stats, setStats] = useState<PlayerStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await fetch(
					`/api/games/memory-match/player-stats?player1Id=${player1Id}&player2Id=${player2Id}`
				);
				if (response.ok) {
					const data = await response.json();
					setStats(data.stats);
				}
			} catch (error) {
				console.error("Failed to fetch player stats:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, [player1Id, player2Id]);

	if (loading) {
		return (
			<div className='bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-surface-border animate-pulse'>
				<div className='h-6 bg-surface rounded w-32 mx-auto mb-2'></div>
				<div className='h-4 bg-surface rounded w-24 mx-auto'></div>
			</div>
		);
	}

	if (!stats || stats.gamesPlayed === 0) {
		return null;
	}

	return (
		<div className='bg-surface/50 backdrop-blur-sm rounded-xl p-4 border border-surface-border'>
			<h3 className='text-sm font-semibold text-text-secondary text-center mb-3'>
				Session Stats
			</h3>
			<div className='flex justify-center gap-6'>
				<div className='text-center'>
					<div className='flex items-center justify-center gap-1 mb-1'>
						<FiAward className='w-4 h-4 text-success' />
						<span className='text-2xl font-bold text-text-primary'>{stats.wins}</span>
					</div>
					<p className='text-xs text-text-secondary'>Wins</p>
				</div>
				<div className='text-center'>
					<div className='flex items-center justify-center gap-1 mb-1'>
						<FiX className='w-4 h-4 text-danger' />
						<span className='text-2xl font-bold text-text-primary'>{stats.losses}</span>
					</div>
					<p className='text-xs text-text-secondary'>Losses</p>
				</div>
				<div className='text-center'>
					<div className='flex items-center justify-center gap-1 mb-1'>
						<FiMinus className='w-4 h-4 text-text-secondary' />
						<span className='text-2xl font-bold text-text-primary'>{stats.draws}</span>
					</div>
					<p className='text-xs text-text-secondary'>Draws</p>
				</div>
			</div>
			<p className='text-xs text-text-tertiary text-center mt-3'>
				{stats.gamesPlayed} {stats.gamesPlayed === 1 ? "game" : "games"} played together
			</p>
		</div>
	);
}
