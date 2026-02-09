"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
	href: string;
	label: string;
};

export function DesktopNav({ items }: { items: NavItem[] }) {
	const pathname = usePathname();

	return (
		<nav className="hidden sm:flex items-center gap-1">
			{items.map((link) => {
				const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
				return (
					<Link
						key={link.href}
						href={link.href}
						className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
							isActive
								? "bg-brand-muted text-brand-text"
								: "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
						}`}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}
