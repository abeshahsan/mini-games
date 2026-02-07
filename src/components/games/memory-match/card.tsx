import { MemoryMatchCard as CardType } from "@/types";

type CardProps = {
	card: CardType;
	isMyTurn: boolean;
	isProcessing: boolean;
	handleCardClick: (cardId: number) => void;
};

export function Card({ card, isMyTurn, isProcessing, handleCardClick }: CardProps) {
	return (
		<div
			key={card.id}
			onClick={() => handleCardClick(card.id)}
			className={`relative aspect-square cursor-pointer transition-all duration-500 transform-3d ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""} ${!isMyTurn || isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
		>
			{/* Card Front (Hidden) */}
			<div className='absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-md border-2 border-indigo-100 dark:border-slate-700 flex items-center justify-center backface-hidden'>
				<span className='text-2xl font-bold text-indigo-200 dark:text-slate-700'>?</span>
			</div>

			{/* Card Back (Word) */}
			<div
				className={`absolute inset-0 rounded-lg shadow-lg flex items-center justify-center p-2 backface-hidden rotate-y-180 ${card.isMatched ? "bg-green-100 dark:bg-green-900/30 border-green-500 shadow-green-100/50" : "bg-white dark:bg-slate-700 border-indigo-400"} border-2 `}
			>
				<span
					className={` font-bold text-center wrap-break-word ${card.isMatched ? "text-green-700 dark:text-green-400" : "text-slate-900 dark:text-white"} ${card.word.length > 8 ? "text-xs italic" : "text-sm sm:text-base"} `}
				>
					{card.word}
				</span>
			</div>
		</div>
	);
}
