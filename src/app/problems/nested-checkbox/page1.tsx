"use client";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";

type Checkbox = {
	id: number;
	label: string;
	children?: Checkbox[];
};

const CheckboxesData: Checkbox[] = [
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

const render = (data: Checkbox[]) => {
	return data?.map((box: Checkbox) => (
		<div key={box.id} className="w-full ml-3">
			<input type="checkbox" name="" id={box.id.toString()} />
			<label htmlFor="" className="ml-3">
				{box.label}
			</label>
			{box.children && render(box.children)}
		</div>
	));
};

const Checkboxes = ({ data, handleUpdate }: { data: Checkbox[]; handleUpdate: (data: Checkbox[]) => void }) => {
	// return render(data);
	return data?.map((box: Checkbox) => (
		<div key={box.id} className="w-full ml-3">
			<input type="checkbox" name="" id={box.id.toString()} />
			<label htmlFor="" className="ml-3">
				{box.label}
			</label>
			{box.children && Checkboxes(box.children, handleUpdate)}
		</div>
	));
};

const NestedCheckbox = () => {
	const [checkboxesData, setCheckboxesData] = useState<Checkbox[]>(CheckboxesData);
	const handleUpdate = useCallback(setCheckboxesData, []);
	return (
		<div className="p-6 w-1/3 mx-auto flex flex-col justify-center items-center">
			<h1 className="text-4xl py-10">Nested Checkbox</h1>
			<Checkboxes data={checkboxesData} update={handleUpdate} />
		</div>
	);
};

export default NestedCheckbox;
