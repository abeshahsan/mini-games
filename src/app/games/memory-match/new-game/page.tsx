"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function NewGamePage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;
		const abortController = new AbortController();

		async function createGame() {
			try {
				// StrictMode in development causes double render - AbortController prevents duplicate API calls
				const response = await fetch("/api/games/memory-match/new-game", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					signal: abortController.signal,
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
				// Ignore abort errors (expected in StrictMode)
				if (err.name === "AbortError") return;
				
				if (isMounted) {
					setError(err.message || "An unexpected error occurred.");
				}
			}
		}

		createGame();

		return () => {
			isMounted = false;
			abortController.abort();
		};
	}, [router]);

	return (
		<main className='flex items-center justify-center min-h-screen bg-bg-primary'>
			<div className='w-full max-w-md p-8 bg-surface backdrop-blur-sm rounded-2xl border border-surface-border mx-4 text-center' style={{ boxShadow: "var(--shadow-xl)" }}>
				{!error ?
					<div className='flex flex-col items-center gap-6'>
						{/* Game icon */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src='/assets/logos/logo-icon-only-128.png'
							alt='Memory Match'
							className='w-20 h-20 rounded-xl'
						/>
						<div className='relative h-12 w-12'>
							<div className='absolute inset-0 rounded-full border-4 border-spinner-track'></div>
							<div className='absolute inset-0 rounded-full border-4 border-spinner border-t-transparent animate-spin'></div>
						</div>
						<div className='space-y-2'>
							<h1 className='text-2xl font-bold text-text-primary'>Setting up your game</h1>
							<p className='text-text-secondary'>Shuffling cards and preparing the board...</p>
						</div>
					</div>
				:	<div className='flex flex-col items-center gap-4'>
						<div className='h-12 w-12 flex items-center justify-center rounded-full bg-danger-muted'>
							<FiAlertCircle className='w-6 h-6 text-danger' />
						</div>
						<h1 className='text-xl font-bold text-text-primary'>Something went wrong</h1>
						<p className='text-text-secondary'>{error}</p>
						<button
							onClick={() => window.location.reload()}
							className='mt-2 inline-flex items-center gap-2 rounded-xl bg-brand py-2.5 px-6 text-sm font-semibold text-text-inverse hover:bg-brand-hover transition-colors'
							style={{ boxShadow: "var(--shadow-brand)" }}
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
