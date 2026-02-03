const WORDS = ["Apple", "Banana", "Cherry", "Dragonfruit", "Elderberry", "Fig", "Grape", "Honeydew"];

export const generateCards = () => {
	return [...WORDS, ...WORDS]
		.sort(() => Math.random() - 0.5)
		.map((word, index) => ({
			id: index,
			word,
			isFlipped: false,
			isMatched: false,
		}));
};

export async function POST() {
	return new Response(JSON.stringify({ cards: generateCards() }));
}
