import { FiAlertCircle } from "react-icons/fi";

export function LoadingGame({ error }: { error: string | null }) {
	return (
		<div className='min-h-screen bg-linear-to-br from-slate-900 to-indigo-950 flex items-center justify-center'>
			<div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700/50 text-center'>
				{error ?
					<div className='flex flex-col items-center gap-3'>
						<div className='h-12 w-12 flex items-center justify-center rounded-full bg-red-500/10'>
							<FiAlertCircle className='w-6 h-6 text-red-400' />
						</div>
						<p className='text-lg font-semibold text-red-400'>{error}</p>
					</div>
				:	<div className='flex flex-col items-center gap-4'>
						<div className='h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
						<p className='text-lg font-semibold text-slate-300'>Loading game...</p>
					</div>
				}
			</div>
		</div>
	);
}
