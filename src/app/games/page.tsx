import { getAllGames } from "@/src/app/core/game.registry";
import Link from "next/link";

export default function GamesPage() {
	const games = getAllGames();

	return (
		<div className='min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-7xl mx-auto'>
				<div className='text-center mb-16'>
					<h1 className='text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl'>
						<span className='block'>Welcome to the</span>
						<span className='block text-indigo-600 dark:text-indigo-400'>Mini-Games Arena</span>
					</h1>
					<p className='mt-3 max-w-md mx-auto text-base text-slate-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
						Pick a game and challenge yourself or your friends!
					</p>
				</div>

				<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					{games.map((game) => (
						<Link
							key={game.id}
							href={game.iscomPleted ? game.route : "#"}
							className='group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
						>
							<div className='aspect-h-9 aspect-w-16 h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden'>
								{/* Gradient overlay for games without icons or as a background */}
								<div
									className={`absolute inset-0 bg-linear-to-br transition-opacity duration-300 group-hover:opacity-80
									${
										game.id === "ticTacToe" ? "from-blue-500 to-cyan-400"
										: game.id === "snake" ? "from-green-500 to-emerald-400"
										: game.id === "memoryMatch" ? "from-purple-500 to-pink-400"
										: "from-indigo-500 to-purple-400"
									}`}
								/>
								<div className='flex items-center justify-center h-full relative z-10'>
									<span className='text-white text-5xl font-bold opacity-20 group-hover:opacity-40 transition-opacity'>
										{game.name[0]}
									</span>
								</div>
							</div>
							<div className='flex flex-1 flex-col p-6'>
								<h3 className='text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
									{game.name}
								</h3>
								<p className='mt-2 flex-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2'>
									{game.description}
								</p>
								{game.iscomPleted ?
									<div className='mt-6 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400'>
										Play Now
										<svg
											className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9 5l7 7-7 7'
											/>
										</svg>
									</div>
								:	<div className='mt-6 flex items-center text-sm font-semibold text-gray-400 cursor-not-allowed'>
										Coming Soon
									</div>
								}
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
