"use client";
import React, { useState } from "react";

type Checkbox = {
	id: number;
	label: string;
	checked: boolean;
	parent: undefined | number;
	children?: Checkbox[];
};

type ogCheck = {
	id: number;
	label: string;
	children?: ogCheck[];
};

const CheckboxesData: ogCheck[] = [
	{
		id: 1,
		label: "Fruits",
		children: [
			{ id: 2, label: "Apple" },
			{ id: 3, label: "Banana" },
			{
				id: 4,
				label: "Citrus",
				children: [
					{ id: 5, label: "Orange" },
					{ id: 6, label: "Lemon" },
				],
			},
		],
	},
	{
		id: 7,
		label: "Vegetables",
		children: [
			{ id: 8, label: "Carrot" },
			{ id: 9, label: "Broccoli" },
		],
	},
];

const buildData = (boxes: ogCheck[], parent: number | undefined): Checkbox[] => {
	return boxes.map((box) => {
		if (box.children) {
			box.children = buildData(box.children, box.id);
		}

		return {
			...box,
			parent,
		} as Checkbox;
	});
};

const NestedCheckbox = () => {
	const [checkboxesData, setCheckboxesData] = useState<Checkbox[]>(buildData(CheckboxesData, undefined));

	const updateTree = (boxes: Checkbox[], cb: (box: Checkbox) => boolean): Checkbox[] => {
		return boxes.map((box) => {
			if (cb(box)) {
				return box;
			}

			if (box.children) {
				box.children = updateTree(box.children, cb);
			}

			return box;
		});
	};

	const ut = (boxes: Checkbox[], cb: (box: Checkbox) => number): Checkbox[] => {
		return boxes.map((box) => {
			if (box.children) {
				box.children = ut(box.children, cb);
				const count = cb(box);
				if (count === box.children.length) {
					box.checked = true;
				} else {
					box.checked = false;
				}
			}

			return box;
		});
	};

	const handleClick = (id: number) => {
		let boxes = [...checkboxesData];
		boxes = updateTree(boxes, (box) => {
			if (box.id === id) {
				box.checked = !box.checked;
				if (box.children) {
					updateTree(box.children, (b) => {
						b.checked = box.checked;
						return false;
					});
				}
				return true;
			}

			return false;
		});

		boxes = ut(boxes, (box) => {
			if (box.children && box.children.length > 0) {
				let count = 0;
				box.children.forEach((b) => {
					count += b.checked ? 1 : -1;
				});

				return count;
			}
			return 0;
		});

		setCheckboxesData(boxes);
	};

	const render = (data: Checkbox[]) => {
		return data?.map((box: Checkbox) => (
			<div key={box.id} className="w-full ml-3">
				<input
					type="checkbox"
					name={box.label}
					id={box.id.toString()}
					checked={box.checked}
					onChange={() => handleClick(box.id)}
				/>
				<label htmlFor="" className="ml-3">
					{box.label}
				</label>
				{box.children && render(box.children)}
			</div>
		));
	};

	return (
		<div className="p-6 w-1/3 mx-auto flex flex-col justify-center items-center">
			<h1 className="text-4xl py-10">Nested Checkbox</h1>
			{render(checkboxesData)}
		</div>
	);
};

export default NestedCheckbox;
