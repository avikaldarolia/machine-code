"use client";
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { setTimeout } from "timers";

const API = `https://dummyjson.com/recipes`;
const LIMIT = 10;

type Recipe = {
	id: number;
	name: string;
	tags: string[];
};

const AutoComplete = () => {
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const [query, setQuery] = useState("");
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const Hash = useMemo(() => new Map<string, Recipe[]>(), []);

	const fetchData = useCallback(
		async (normalizedQuery: string) => {
			if (normalizedQuery.trim() === "") {
				setRecipes(null);
				return;
			}
			try {
				if (Hash.has(normalizedQuery)) {
					const values = Hash.get(normalizedQuery);
					setRecipes([...(values ?? [])]);
					return;
				}
				const data = await fetch(
					`${API}/search?q=${normalizedQuery}&limit=${LIMIT}`
				);
				const res = await data.json();
				const mapres: Recipe[] = res.recipes;
				setRecipes(res.recipes);
				Hash.set(normalizedQuery, [...mapres]);
			} catch (error) {
				console.error("Failed to fetch recipes:", error);
				setRecipes(null);
			}
		},
		[Hash]
	);

	useEffect(() => {
		const normalizedQuery = query.trim().toLowerCase();

		if (timer.current) {
			clearTimeout(timer.current);
		}

		timer.current = setTimeout(() => {
			fetchData(normalizedQuery);
		}, 500);

		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, [fetchData, query]);

	return (
		<div className="p-6 w-1/3 mx-auto flex flex-col justify-center items-center">
			<h2 className="text-2xl font-bold m-4">Auto complete search</h2>
			<input
				type="text"
				placeholder="Search a Recipe..."
				value={query}
				className="outline-white border border-white rounded-lg p-2 mt-10 w-full"
				onChange={(e) => setQuery(e.target.value)}
			/>

			{recipes && recipes.length > 0 ? (
				recipes.map((recipe) => (
					<div
						key={recipe.id}
						className="w-full border border-white  p-2 hover:opacity-90 cursor-pointer hover:bg-gray-400">
						<p>{recipe.name}</p>
					</div>
				))
			) : query.trim() && recipes?.length === 0 ? (
				<p className="mt-4 text-gray-400">No recipes found.</p>
			) : null}
		</div>
	);
};

export default AutoComplete;
