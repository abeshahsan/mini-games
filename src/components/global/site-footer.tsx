import Link from "next/link";
import { FiGithub, FiHeart } from "react-icons/fi";

export function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="relative z-50 border-t border-surface-border bg-bg-secondary">
			<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				{/* Top row — branding + links */}
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
					{/* Brand column */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-2.5">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src="/assets/logos/logo-icon-only-64.png"
								alt="PlayClassix"
								className="w-7 h-7 rounded"
							/>
							<span className="text-base font-bold text-text-primary">
								Play<span className="text-brand-text">Classix</span>
							</span>
						</div>
						<p className="text-sm text-text-tertiary max-w-xs leading-relaxed">
							Classic online games for everyone. Play with friends in your browser — no downloads, no sign-ups.
						</p>
					</div>

					{/* Navigation column */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">
							Navigate
						</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
									Home
								</Link>
							</li>
							<li>
								<Link href="/games" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
									All Games
								</Link>
							</li>
						</ul>
					</div>

					{/* Games column */}
					<div>
						<h4 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-3">
							Games
						</h4>
						<ul className="space-y-2">
							<li>
								<Link href="/games/memory-match/new-game" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
									Memory Match
								</Link>
							</li>
							<li>
								<span className="text-sm text-text-tertiary cursor-default">
									Tic Tac Toe <span className="text-[10px] uppercase font-semibold bg-bg-tertiary px-1.5 py-0.5 rounded ml-1">Soon</span>
								</span>
							</li>
							<li>
								<span className="text-sm text-text-tertiary cursor-default">
									Snake <span className="text-[10px] uppercase font-semibold bg-bg-tertiary px-1.5 py-0.5 rounded ml-1">Soon</span>
								</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Divider */}
				<div className="mt-8 pt-6 border-t border-surface-border">
					<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
						<p className="text-xs text-text-tertiary">
							&copy; {year} PlayClassix. All rights reserved.
						</p>
						<p className="text-xs text-text-tertiary inline-flex items-center gap-1">
							Made with <FiHeart className="w-3 h-3 text-danger" /> for game lovers
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
