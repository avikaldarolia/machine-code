"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const API = "https://dummyjson.com/products?limit=100";

const LIMIT = 10;

type Product = {
	id: string;
	title: string;
	thumbnail: string;
};

const Pagination = () => {
	const [products, setProducts] = useState<Product[] | undefined>(undefined);
	const pages = Array.from({ length: 20 }, (_, i) => i + 1);
	const [activePage, setActivePage] = useState(1);

	useEffect(() => {
		const fetchData = async () => {
			const data = await fetch(API);
			const res = await data.json();
			setProducts(res.products);
		};

		fetchData();
	}, []);

	const end = LIMIT * activePage - 1;
	const start = end - LIMIT + 1;

	const currentProducts = products?.slice(start, end);

	return (
		<div className="p-6 w-2/3 mx-auto flex flex-col justify-center items-center">
			<h1 className="text-4xl py-10">Pagination</h1>

			<div className="w-full flex flex-wrap items-center justify-center gap-2">
				{currentProducts ? (
					currentProducts?.slice(0, 10).map((product) => (
						<div
							key={product.id}
							className="flex flex-col w-full md:w-1/5 p-2 items-center justify-center border border-white rounded-lg">
							<Image
								className="object-fill"
								src={product.thumbnail}
								width={400}
								height={100}
								alt="Picture of the author"
							/>
							<p>{product.title}</p>
						</div>
					))
				) : (
					<p>No Products found.</p>
				)}
			</div>

			<div className="w-full flex items-center justify-around my-2">
				<button
					className={`p-2 ${activePage === 1 && "cursor-not-allowed"}`}
					disabled={activePage === 1}
					onClick={() => setActivePage((p) => Math.max(1, p - 1))}>
					Left
				</button>
				<div className="w-full flex justify-around">
					{pages &&
						pages.map((page) => (
							<button
								className={`border p-2 ${page === activePage ? "border-amber-300" : "border-white"}`}
								onClick={() => setActivePage(page)}
								key={page}>
								{page}
							</button>
						))}
				</div>
				<button className="p-2" onClick={() => setActivePage((p) => Math.min(20, p + 1))} disabled={activePage === 20}>
					Right
				</button>
			</div>
		</div>
	);
};

export default Pagination;
