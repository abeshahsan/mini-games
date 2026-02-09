import { getAllGames } from "@/core/game.registry";
import Link from "next/link";

export default function GamesPage() {
	const games = getAllGames();

	function generateGameURL(gameSlug: string) {
		return `/games/${gameSlug}/new-game`;
	}

	return (
		<div className='min-h-[calc(100vh-3.5rem)] bg-bg-primary'>
			{/* Hero section */}
			<section className='relative overflow-hidden bg-linear-to-br from-brand-muted to-accent-muted'>
				<div className='relative z-10 py-14 px-4 sm:px-6 lg:px-8 text-center'>
					<div className='max-w-3xl mx-auto'>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src='/assets/logos/logo-full-color.svg'
							alt='PlayClassix'
							className='mx-auto mb-6 h-20 w-20 drop-shadow-lg'
						/>
						<h1 className='text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl'>
							Game Library
						</h1>
						<p className='mt-3 max-w-lg mx-auto text-base text-text-secondary sm:text-lg'>
							Pick a game and challenge yourself or your friends!
						</p>
					</div>
				</div>
			</section>

			<div className='py-12 px-4 sm:px-6 lg:px-8'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
						{games.map((game) => (
							<Link
								key={game.id}
								href={game.iscomPleted ? generateGameURL(game.slug) : "#"}
								className='group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-surface-border transition-all duration-300 hover:-translate-y-2 hover:border-(--surface-border-hover)'
								style={{ boxShadow: "var(--shadow-md)" }}
							>
								<div className='h-48 bg-bg-tertiary relative overflow-hidden'>
									{/* Gradient overlay */}
									<div
										className={`absolute inset-0 bg-linear-to-br transition-opacity duration-300 group-hover:opacity-80
										${
											game.id === "ticTacToe" ? "from-blue-500 to-cyan-400"
											: game.id === "snake" ? "from-green-500 to-emerald-400"
											: game.id === "memoryMatch" ? "from-purple-500 to-pink-400"
											: "from-indigo-500 to-purple-400"
										}`}
									/>
									{/* Game icon */}
									<div className='flex items-center justify-center h-full relative z-10'>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={game.icon}
											alt={game.name}
											className='w-20 h-20 rounded-xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 drop-shadow-lg'
										/>
									</div>
								</div>
								<div className='flex flex-1 flex-col p-6'>
									<h3 className='text-xl font-bold text-text-primary group-hover:text-brand-text transition-colors'>
										{game.name}
									</h3>
									<p className='mt-2 flex-1 text-sm text-text-secondary line-clamp-2'>
										{game.description}
									</p>
									{game.iscomPleted ?
										<div className='mt-6 flex items-center text-sm font-semibold text-brand-text'>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src='/assets/ui/btn-play-32.png'
												alt=''
												className='w-5 h-5 mr-2'
											/>
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
									:	<div className='mt-6 flex items-center text-sm font-semibold text-text-tertiary cursor-not-allowed'>
											Coming Soon
										</div>
									}
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
