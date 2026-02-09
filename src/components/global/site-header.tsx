"use client";

import { HeaderLogo, DesktopNav, MobileNav, ThemeSwitcher } from "@/components/global/header";
import type { NavItem } from "@/components/global/header";

const NAV_ITEMS: NavItem[] = [];

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-header-bg border-header-border backdrop-blur-md">
			<div className='relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				<HeaderLogo />
				<DesktopNav items={NAV_ITEMS} />
				<div className='flex items-center gap-2'>
					<ThemeSwitcher />
					<MobileNav items={NAV_ITEMS} />
				</div>
			</div>
		</header>
	);
}
