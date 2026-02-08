import { MemoryMatchPlayer, Gamer } from "@/types";
import { FiAward } from "react-icons/fi";

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
								isWinner
									? "bg-yellow-500/10 border-2 border-yellow-500/50"
									: "bg-slate-700/50 border border-slate-600/30"
							}`}
						>
							<div className='flex justify-between items-center'>
								<span className='font-semibold text-slate-200 inline-flex items-center gap-1.5'>
									{isWinner && <FiAward className='w-4 h-4 text-yellow-400' />}
									{player.username} {isMe && "(You)"}
								</span>
								<span className='font-bold text-lg text-indigo-400'>
									{player.score} {player.score === 1 ? "match" : "matches"}
								</span>
							</div>
						</div>
					);
				})}
		</div>
	);
}
