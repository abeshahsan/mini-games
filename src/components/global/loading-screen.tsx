type LoadingScreenProps = {
	message?: string;
};

export function LoadingScreen({ message = "Loading…" }: LoadingScreenProps) {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
			{/* Background image layer */}
			<div className="absolute inset-0 -z-10">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/assets/splash/loading-bg-1920x1080.png"
					alt=""
					className="h-full w-full object-cover"
					aria-hidden="true"
				/>
			</div>

			{/* Logo + spinner */}
			<div className="flex flex-col items-center gap-6 rounded-2xl bg-surface p-10 backdrop-blur-md border border-surface-border" style={{ boxShadow: "var(--shadow-xl)" }}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/assets/logos/logo-full-color-256.png"
					alt="PlayClassix"
					width={128}
					height={128}
				/>
				<div className="h-10 w-10 rounded-full border-4 border-spinner border-t-transparent animate-spin" />
				<p className="text-sm font-medium text-text-secondary">{message}</p>
			</div>
		</div>
	);
}
