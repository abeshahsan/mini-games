"use client";

import Link from "next/link";
import { FiArrowRight, FiZap, FiUsers, FiGlobe } from "react-icons/fi";

const features = [
	{ icon: FiZap, title: "Instant Play", desc: "No downloads — play right in your browser" },
	{ icon: FiUsers, title: "Multiplayer", desc: "Challenge friends in real-time" },
	{ icon: FiGlobe, title: "Free Forever", desc: "No sign-ups, no paywalls" },
];

export default function Home() {
	return (
		<div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
			{/* Hero section */}
			<section className="relative flex-1 flex items-center overflow-hidden">
				{/* Background banner SVG — decorative */}
				<div className="absolute inset-0 -z-10 opacity-[0.06]">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/assets/marketing/banner.svg"
						alt=""
						aria-hidden="true"
						className="h-full w-full object-cover"
					/>
				</div>

				{/* Gradient overlay — subtle brand tint */}
				<div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-muted via-transparent to-accent-muted" />

				<div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center">
					{/* Logo */}
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="/assets/logos/logo-full-color.svg"
						alt="PlayClassix"
						className="mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-8 drop-shadow-lg rounded-2xl"
					/>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary leading-tight">
						Classic games,{" "}
						<span className="text-brand-text">modern fun.</span>
					</h1>

					<p className="mt-4 mx-auto max-w-2xl text-lg sm:text-xl text-text-secondary leading-relaxed">
						Play your favourite classic games online with friends — Memory Match, Tic Tac Toe, Snake and more — free in your browser.
					</p>

					{/* CTA buttons */}
					<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							href="/games"
							className="inline-flex items-center gap-2.5 rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-text-inverse hover:bg-brand-hover transition-all duration-200 active:scale-[0.97]"
							style={{ boxShadow: "var(--shadow-brand)" }}
						>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src="/assets/ui/btn-play-32.png" alt="" className="w-5 h-5" />
							Browse Games
							<FiArrowRight className="w-4 h-4" />
						</Link>
					</div>

					{/* Feature pills */}
					<div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
						{features.map((f) => (
							<div
								key={f.title}
								className="flex flex-col items-center gap-2 p-5 rounded-xl bg-surface border border-surface-border transition-shadow hover:shadow-md"
								style={{ boxShadow: "var(--shadow-sm)" }}
							>
								<div className="p-2.5 rounded-lg bg-brand-muted">
									<f.icon className="w-5 h-5 text-brand-text" />
								</div>
								<h3 className="text-sm font-bold text-text-primary">{f.title}</h3>
								<p className="text-xs text-text-tertiary leading-relaxed">{f.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Banner strip */}
			<div className="w-full overflow-hidden">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/assets/marketing/banner-1200x400.webp"
					alt="PlayClassix Banner"
					className="w-full h-24 sm:h-32 object-cover opacity-90"
				/>
			</div>
		</div>
	);
}
