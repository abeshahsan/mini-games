import { Gamer } from "@/types";
import { create } from "zustand";

type GamerState = {
	gamer: Gamer | null;
	fetchGamer: () => Promise<void>;
};

export const useGamerStore = create<GamerState>((set) => ({
	gamer: null,
	fetchGamer: async () => {
		try {
			const response = await fetch("/api/me");
			if (!response.ok) {
				set({ gamer: null });
				return;
			}
			const data = await response.json();
			set({
				gamer: {
					id: data.uid,
					ign: data.username,
				},
			});
		} catch (e) {
			console.log("Error fetching user:", e);
			set({ gamer: null });
		}
	},
}));
