import Link from "next/link";

export function HeaderLogo() {
	return (
		<Link href="/" className="flex items-center gap-2.5 group">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src="/assets/logos/logo-icon-only-128.png"
				alt="PlayClassix"
				width={32}
				height={32}
				className="rounded-lg transition-transform duration-200 group-hover:scale-105"
			/>
			<span className="hidden sm:inline-block text-lg font-bold tracking-tight text-text-primary">
				Play<span className="text-brand-text">Classix</span>
			</span>
		</Link>
	);
}
