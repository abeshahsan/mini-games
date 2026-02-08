import { Gamer, MemoryMatchPlayer } from "@/types";

export function ScoreBoardPlayers({
	players,
	gamer,
	currentTurn,
}: {
	players: MemoryMatchPlayer[];
	gamer: Gamer | null;
	currentTurn: string;
}) {
	return (
		<div className='grid grid-cols-2 gap-3'>
			{players.map((player) => {
				const isCurrent = currentTurn === player.id;
				const isMe = gamer?.id === player.id;

				return (
					<div
						key={player.id}
						className={`p-3 rounded-lg transition-all ${
							isCurrent
								? "bg-indigo-500/10 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/5"
								: "bg-slate-700/30 border-2 border-transparent"
						}`}
					>
						<div className='flex items-center justify-between'>
							<div>
								<p
									className={`font-semibold text-sm ${
										isCurrent ? "text-indigo-300" : "text-slate-300"
									}`}
								>
									{player.username} {isMe && "(You)"}
								</p>
								<p className='text-xs text-slate-500'>Score: {player.score}</p>
							</div>
							{isCurrent && (
								<div className='flex items-center gap-1'>
									<div className='h-2 w-2 bg-green-500 rounded-full animate-pulse'></div>
									<span className='text-xs font-semibold text-green-400'>Turn</span>
								</div>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
