import { MemoryMatchPlayer, Gamer } from "@/types";

export function FinalScores({ players, gamer }: { players: MemoryMatchPlayer[]; gamer: Gamer }) {
	return (
		<div className='mb-4 space-y-2'>
			{players
				.sort((a, b) => b.score - a.score)
				.map((player, index) => {
					const isMe = gamer.id === player.id;
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
	);
}
