import { FiAlertCircle } from "react-icons/fi";

export function GameError({ message }: { message: string | null }) {
	return (
		message && (
			<div className='mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center animate-in fade-in duration-200'>
				<p className='text-sm font-semibold text-red-400 inline-flex items-center gap-1.5'>
					<FiAlertCircle className='w-4 h-4' />
					{message}
				</p>
			</div>
		)
	);
}
