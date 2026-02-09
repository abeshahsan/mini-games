export type MedalType = "gold" | "silver" | "bronze" | "champion" | "complete" | "streak";

type MedalBadgeProps = {
	type: MedalType;
	size?: 64 | 128;
	label?: string;
};

const medalLabels: Record<MedalType, string> = {
	gold: "1st Place",
	silver: "2nd Place",
	bronze: "3rd Place",
	champion: "Champion",
	complete: "Game Complete",
	streak: "Win Streak",
};

export function MedalBadge({ type, size = 64, label }: MedalBadgeProps) {
	const displayLabel = label ?? medalLabels[type];

	return (
		<div className="flex flex-col items-center gap-1">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={`/assets/ui/medals/medal-${type}-${size}.png`}
				alt={displayLabel}
				width={size}
				height={size}
				className="drop-shadow-lg"
			/>
			<span className="text-xs font-semibold text-text-secondary">{displayLabel}</span>
		</div>
	);
}
