"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function NewGamePage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		async function createGame() {
			try {
				const response = await fetch("/api/games/memory-match/new-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
				});

				if (!response.ok) {
					throw new Error("Failed to create a new game.");
				}

				const data = await response.json();

				if (isMounted && data.gameId) {
					router.push(`/games/memory-match/${data.gameId}`);
				} else if (isMounted) {
					throw new Error("Game ID was not returned from the server.");
				}
			} catch (err: any) {
				if (isMounted) {
					setError(err.message || "An unexpected error occurred.");
				}
			}
		}

		createGame();

		return () => {
			isMounted = false;
		};
	}, [router]);

	return (
		<main className='flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-indigo-950'>
			<div className='w-full max-w-md p-8 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 mx-4 text-center'>
				{!error ?
					<div className='flex flex-col items-center gap-6'>
						<div className='relative h-16 w-16'>
							<div className='absolute inset-0 rounded-full border-4 border-slate-700'></div>
							<div className='absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin'></div>
						</div>
						<div className='space-y-2'>
							<h1 className='text-2xl font-bold text-white'>Setting up your game</h1>
							<p className='text-slate-400'>Shuffling cards and preparing the board...</p>
						</div>
					</div>
				:	<div className='flex flex-col items-center gap-4'>
						<div className='h-12 w-12 flex items-center justify-center rounded-full bg-red-500/10'>
							<FiAlertCircle className='w-6 h-6 text-red-400' />
						</div>
						<h1 className='text-xl font-bold text-white'>Something went wrong</h1>
						<p className='text-slate-400'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='mt-2 inline-flex items-center gap-2 rounded-xl bg-indigo-600 py-2.5 px-6 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20'
						>
							<FiRefreshCw className='w-4 h-4' />
							Try Again
						</button>
					</div>
				}
			</div>
		</main>
	);
}
