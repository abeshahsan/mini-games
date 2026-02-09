import { MemoryMatchPlayer, Gamer } from "@/types";
import { PlayerStatsDisplay } from "./player-stats";

const MEDAL_ICONS = [
	"/assets/ui/medals/medal-gold-64.png",
	"/assets/ui/medals/medal-silver-64.png",
	"/assets/ui/medals/medal-bronze-64.png",
] as const;

export function FinalScores({ players, gamer }: { players: MemoryMatchPlayer[]; gamer: Gamer }) {
	return (
		<div className='mb-4 space-y-3'>
			{players
				.sort((a, b) => b.score - a.score)
				.map((player, index) => {
					const isMe = gamer.id === player.id;
					const isWinner = index === 0;
					const medalSrc = MEDAL_ICONS[index];

					return (
						<div
							key={player.id}
							className={`p-3 rounded-lg ${
								isWinner
									? "bg-warning-muted border-2 border-warning/50"
									: "bg-bg-tertiary border border-surface-border"
							}`}
						>
							<div className='flex justify-between items-center'>
								<span className='font-semibold text-text-primary inline-flex items-center gap-2'>
									{medalSrc && (
										/* eslint-disable-next-line @next/next/no-img-element */
										<img src={medalSrc} alt={`#${index + 1}`} className='w-6 h-6' />
									)}
									{player.username} {isMe && "(You)"}
								</span>
								<span className='font-bold text-lg text-brand-text'>
									{player.score} {player.score === 1 ? "match" : "matches"}
								</span>
							</div>
						</div>
					);
				})}
			
			{/* Show stats if there are exactly 2 players */}
			{players.length === 2 && (
				<PlayerStatsDisplay player1Id={players[0].id} player2Id={players[1].id} />
			)}
		</div>
	);
}
