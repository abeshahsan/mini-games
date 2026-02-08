import { FiTarget } from "react-icons/fi";

type Props = {
	isMyTurn: boolean;
	isWon: boolean;
};

export function TurnIndicator({ isMyTurn, isWon }: Props) {
	return (
		<>
			{isMyTurn && !isWon && (
				<div className='mt-3 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-center'>
					<p className='text-sm font-bold text-green-400 inline-flex items-center gap-1.5'>
						<FiTarget className='w-4 h-4' />
						It&apos;s your turn!
					</p>
				</div>
			)}

			{!isMyTurn && !isWon && (
				<div className='mt-3 p-2 bg-slate-700/50 rounded-lg text-center'>
					<p className='text-sm font-medium text-slate-400'>Waiting for opponent...</p>
				</div>
			)}
		</>
	);
}
