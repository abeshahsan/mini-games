"use client";

import { useTheme } from "@/components/global/theme-provider";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

const options = [
	{ value: "light" as const, icon: FiSun, label: "Light" },
	{ value: "dark" as const, icon: FiMoon, label: "Dark" },
	{ value: "system" as const, icon: FiMonitor, label: "System" },
];

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center rounded-full border border-surface-border bg-bg-secondary p-0.5 gap-0.5">
			{options.map(({ value, icon: Icon, label }) => (
				<button
					key={value}
					onClick={() => setTheme(value)}
					title={label}
					aria-label={`Switch to ${label} theme`}
					className={`p-1.5 rounded-full transition-all duration-200 ${
						theme === value
							? "bg-brand text-text-inverse shadow-sm"
							: "text-text-tertiary hover:text-text-primary hover:bg-surface-hover"
					}`}
				>
					<Icon className="w-3.5 h-3.5" />
				</button>
			))}
		</div>
	);
}
