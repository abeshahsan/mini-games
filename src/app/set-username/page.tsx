"use client";

import { setUsernameAction } from "@/app/set-username/action";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";

function SetUserNameForm() {
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const redirectURL = useSearchParams().get("redirect") || "/";
	const router = useRouter();

	function handleSubmitUsername(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);

		const formData = new FormData(event.currentTarget);
		const username = formData.get("username") as string;

		if (!username || username.trim().length < 2) {
			setError("Username must be at least 2 characters long");
			return;
		}

		startTransition(async () => {
			try {
				await setUsernameAction(username);
				setSuccess(true);
				router.replace(redirectURL);
			} catch (e: any) {
				console.log("Error setting username:", e);
				setError("Failed to save username. Please try again.");
			}
		});
	}

	return (
		<div
			className='w-full max-w-md p-8 bg-surface rounded-2xl border border-surface-border'
			style={{ boxShadow: "var(--shadow-xl)" }}
		>
			<div className='mb-8 text-center'>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src='/assets/logos/logo-full-color-128.png'
					alt='PlayClassix'
					className='w-16 h-16 mx-auto mb-4 rounded-xl'
				/>
				<h1 className='text-3xl font-extrabold text-text-primary'>Welcome!</h1>
				<p className='mt-2 text-text-secondary'>Pick a name to start playing</p>
			</div>

			<form
				className='flex flex-col gap-6'
				onSubmit={handleSubmitUsername}
			>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='username'
						className='text-sm font-semibold text-text-secondary ml-1'
					>
						What should we call you?
					</label>
					<input
						type='text'
						id='username'
						name='username'
						placeholder='e.g. MasterGamer'
						className='rounded-xl border border-surface-border p-4 text-text-primary text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-text-tertiary bg-bg-secondary'
						required
						disabled={isPending || success}
						autoComplete='off'
						autoFocus
						minLength={2}
						maxLength={20}
					/>
					{error && <p className='text-danger text-xs mt-1 ml-1 font-medium'>{error}</p>}
				</div>

				<button
					type='submit'
					disabled={isPending || success}
					className='w-full flex justify-center items-center rounded-xl bg-brand py-4 px-6 text-base font-bold text-text-inverse hover:bg-brand-hover active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed'
					style={{ boxShadow: "var(--shadow-brand)" }}
				>
					{isPending ?
						<div className='flex items-center gap-2'>
							<svg
								className='animate-spin h-5 w-5 text-text-inverse'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								></path>
							</svg>
							Saving...
						</div>
					:	"Continue"}
				</button>
			</form>
		</div>
	);
}

export default function SetUserNamePage() {
	return (
		<main className='flex items-center justify-center min-h-[calc(100vh-3.5rem)] bg-bg-primary p-4'>
			<Suspense
				fallback={
					<div
						className='animate-pulse bg-surface w-full max-w-md h-96 rounded-2xl'
						style={{ boxShadow: "var(--shadow-xl)" }}
					></div>
				}
			>
				<SetUserNameForm />
			</Suspense>
		</main>
	);
}
