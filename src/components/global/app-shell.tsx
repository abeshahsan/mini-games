"use client";

import { SiteHeader } from "@/components/global/site-header";
import { Sidebar } from "@/components/global/sidebar";
import { SiteFooter } from "@/components/global/site-footer";
import { usePathname } from "next/navigation";

/**
 * Certain routes render their own full-screen UI and should NOT
 * get the standard sidebar / header / footer chrome.
 */
const FULL_SCREEN_PATTERNS = [
	/^\/games\/[^/]+\/[^/]+$/, // e.g. /games/memory-match/<gameId>
	/^\/games\/[^/]+\/new-game$/, // e.g. /games/memory-match/new-game
];

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isFullScreen = FULL_SCREEN_PATTERNS.some((re) => re.test(pathname));

	if (isFullScreen) {
		return <>{children}</>;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<SiteHeader />
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 lg:ml-60">
					{children}
				</main>
			</div>
			{/* Footer spans full width, below sidebar */}
			<div className="lg:ml-60">
				<SiteFooter />
			</div>
		</div>
	);
}
