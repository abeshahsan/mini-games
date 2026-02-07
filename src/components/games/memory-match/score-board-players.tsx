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
		<>
			<div className='grid grid-cols-2 gap-3'>
				{players.map((player) => {
					const isCurrent = currentTurn === player.id;
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
									<p className='text-xs text-slate-500 dark:text-slate-400'>Score: {player.score}</p>
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
		</>
	);
}
