import { ScoreBoardPlayers } from "@/components/games/memory-match/score-board-players";
import { TurnIndicator } from "@/components/games/memory-match/turn-indicator";
import { Gamer, MemoryMatchGameRoom } from "@/types";
import { useParams } from "next/navigation";
import { FiHash } from "react-icons/fi";

export function GameStatusBar({
	gameRoom,
	gamer,
	isMyTurn,
	isWon,
}: {
	gameRoom: MemoryMatchGameRoom;
	gamer: Gamer;
	isMyTurn: boolean;
	isWon: boolean;
}) {
	const params = useParams();
	const gameId = params.gameId as string;

	return (
		<div className='bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-4 mb-6'>
			<div className='flex justify-between items-center mb-3'>
				<div className='text-sm'>
					<span className='font-semibold text-slate-400'>Moves: </span>
					<span className='text-lg font-bold text-indigo-400'>{gameRoom.moves}</span>
				</div>
				<div className='text-sm inline-flex items-center gap-1'>
					<FiHash className='w-3 h-3 text-slate-500' />
					<span className='text-xs font-mono text-slate-500'>{gameId.slice(0, 8)}</span>
				</div>
			</div>

			<ScoreBoardPlayers
				players={gameRoom.players}
				gamer={gamer}
				currentTurn={gameRoom.currentTurn}
			/>

			<TurnIndicator
				isMyTurn={isMyTurn}
				isWon={isWon}
			/>
		</div>
	);
}
