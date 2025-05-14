"use client";
import React, { useCallback, useEffect, useState } from "react";

const initialEmojis = ["❤️", "🍀", "🌎", "🍎", "⚽️", "🚗", "⛵️", "💎"];

type Card = { id: number; value: string; revealed: boolean; matched: boolean };

let cardArray = Array.from(initialEmojis, (val, idx) => {
	return {
		id: idx,
		value: val,
		revealed: false,
		matched: false,
	};
});

cardArray = [
	...cardArray,
	...Array.from(cardArray, (val, idx) => ({
		...val,
		id: idx + cardArray.length,
	})),
];

const MatchPair = () => {
	const [cards, setCards] = useState<Card[]>(cardArray);
	const [firstCardIndex, setFirstCardIndex] = useState<number | null>(null);
	const [moves, setMoves] = useState(0);
	const [won, setWon] = useState(false);
	const [interactive, setInteractive] = useState(true);

	const shuffle = useCallback(() => {
		const array = [...initialEmojis, ...initialEmojis].map((val, idx) => {
			return {
				id: idx,
				value: val,
				matched: false,
				revealed: false,
			};
		});

		let index = array.length;
		while (index != 0) {
			const randomIndex = Math.floor(Math.random() * index);
			index--;

			[array[index], array[randomIndex]] = [array[randomIndex], array[index]];
		}

		setCards(array);
	}, []);

	useEffect(() => {
		shuffle();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const displayCards = (index1: number, index2: number) => {
		setTimeout(() => {
			const updatedCards = [...cards];
			updatedCards[index1].revealed = false;
			updatedCards[index2].revealed = false;
			setCards(updatedCards);
			setInteractive(true);
		}, 1000);
	};

	const checkWin = (cardsToCheck: Card[]) => {
		const win = cardsToCheck.every((card) => card.matched);
		if (win) {
			setWon(true);
		}
		return win;
	};

	const handleClick = (card: Card, idx: number) => {
		if (card.matched || card.revealed || !interactive) {
			return;
		}

		const updatedCards = [...cards];
		if (firstCardIndex === null) {
			updatedCards[idx].revealed = true;
			setFirstCardIndex(idx);
			return;
		}

		if (card.id === updatedCards[firstCardIndex].id) {
			return;
		}

		setInteractive(false);
		setMoves((move) => move + 1);

		updatedCards[idx].revealed = true;

		if (card.value === updatedCards[firstCardIndex].value) {
			updatedCards[firstCardIndex].matched = true;
			updatedCards[idx].matched = true;
			const win = checkWin(updatedCards);
			if (win) {
				return;
			}
			setInteractive(true);
		} else {
			displayCards(firstCardIndex, idx);
		}

		setFirstCardIndex(null);
		setCards(updatedCards);
	};

	const resetGame = () => {
		shuffle();
		setFirstCardIndex(null);
		setMoves(0);
		setWon(false);
	};

	return (
		<div className="p-6 w-1/3 mx-auto flex flex-col justify-center items-center">
			<h1 className="text-4xl py-10"> Match Pair</h1>
			<div className="grid grid-cols-4 gap-4">
				{cards.map((card, idx) => (
					<div
						key={card.id}
						className={`${
							interactive ? "pointer-events-auto" : "pointer-events-none"
						} w-24 h-24 hover:bg-gray-600 bg-gray-200 border border-white flex items-center justify-center cursor-pointer select-none rounded-[8px] ${
							card.revealed || card.matched ? "revealed" : ""
						}`}
						onClick={() => handleClick(card, idx)}>
						{(card.revealed || card.matched) && card.value}
					</div>
				))}
			</div>
			<p className="mt-10">Moves: {moves}</p>
			{won && <p className="won">🎉 You won!</p>}
			<button className="bg-gray-500 px-3 py-1 rounded-lg" onClick={resetGame}>
				Reset
			</button>
		</div>
	);
};

export default MatchPair;
