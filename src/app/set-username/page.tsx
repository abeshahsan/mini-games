"use client";

import { useState, useTransition, Suspense } from "react";
import { setUsernameAction } from "@/src/app/set-username/action";
import { useSearchParams, useRouter } from "next/navigation";

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
		<div className='w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100'>
			<div className='mb-8 text-center'>
				<h1 className='text-3xl font-extrabold text-gray-900'>Welcome!</h1>
				<p className='mt-2 text-gray-600'>Pick a name to start playing</p>
			</div>

			<form
				className='flex flex-col gap-6'
				onSubmit={handleSubmitUsername}
			>
				<div className='flex flex-col gap-2'>
					<label
						htmlFor='username'
						className='text-sm font-semibold text-gray-700 ml-1'
					>
						What should we call you?
					</label>
					<input
						type='text'
						id='username'
						name='username'
						placeholder='e.g. MasterGamer'
						className='rounded-xl border border-gray-200 p-4 text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 bg-gray-50'
						required
						disabled={isPending || success}
						autoComplete='off'
						autoFocus
						minLength={2}
						maxLength={20}
					/>
					{error && <p className='text-red-500 text-xs mt-1 ml-1 font-medium'>{error}</p>}
				</div>

				<button
					type='submit'
					disabled={isPending || success}
					className='w-full flex justify-center items-center rounded-xl bg-blue-600 py-4 px-6 text-base font-bold text-white hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200'
				>
					{isPending ?
						<div className='flex items-center gap-2'>
							<svg
								className='animate-spin h-5 w-5 text-white'
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
		<main className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
			<Suspense
				fallback={<div className='animate-pulse bg-white w-full max-w-md h-96 rounded-2xl shadow-xl'></div>}
			>
				<SetUserNameForm />
			</Suspense>
		</main>
	);
}
