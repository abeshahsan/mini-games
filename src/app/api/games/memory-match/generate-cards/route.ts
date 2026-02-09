/**
 * Available card image slugs — each corresponds to a file at
 * /assets/cards/card-{slug}-200x280.webp
 */
const CARD_SLUGS = [
	"apple",
	"balloon",
	"butterfly",
	"cat",
	"circus",
	"cupcake",
	"diamond",
	"dice",
	"fire",
	"flower",
	"fox",
	"lightning",
	"moon",
	"music",
	"octopus",
	"panda",
	"parrot",
	"pizza",
	"puzzle",
	"rainbow",
	"rocket",
	"star",
	"target",
	"unicorn",
];

/** Pick `count` random slugs from the pool */
function pickRandom(pool: string[], count: number): string[] {
	const shuffled = [...pool].sort(() => Math.random() - 0.5);
	return shuffled.slice(0, count);
}

export const generateCards = () => {
	const chosen = pickRandom(CARD_SLUGS, 8);
	return [...chosen, ...chosen]
		.sort(() => Math.random() - 0.5)
		.map((slug, index) => ({
			id: index,
			word: slug, // slug used for matching logic
			image: `/assets/cards/card-${slug}-200x280.webp`,
			isFlipped: false,
			isMatched: false,
		}));
};

export async function POST() {
	return new Response(JSON.stringify({ cards: generateCards() }));
}
