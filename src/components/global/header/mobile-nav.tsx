"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import type { NavItem } from "./desktop-nav";

export function MobileNav({ items }: { items: NavItem[] }) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	// Close on route change
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setOpen(false);
	}, [pathname]);

	return (
		<>
			<button
				className='sm:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors'
				onClick={() => setOpen(!open)}
				aria-label={open ? "Close menu" : "Open menu"}
			>
				{open ?
					<FiX className='w-5 h-5' />
				:	<FiMenu className='w-5 h-5' />}
			</button>

			{open && (
				<div className='sm:hidden absolute top-full left-0 right-0 border-t border-surface-border bg-bg-elevated shadow-lg z-50'>
					<nav className='px-4 py-3 space-y-1'>
						{items.map((link) => {
							const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
							return (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setOpen(false)}
									className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
										isActive ?
											"bg-brand-muted text-brand-text"
										:	"text-text-secondary hover:bg-surface-hover hover:text-text-primary"
									}`}
								>
									{link.label}
								</Link>
							);
						})}
					</nav>
				</div>
			)}
		</>
	);
}
