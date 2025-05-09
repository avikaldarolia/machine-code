"use client";
import React, { useState } from "react";

type Checkbox = {
	id: number;
	label: string;
	checked?: boolean;
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

const buildTree = (nodes: Checkbox[]): Checkbox[] => {
	return nodes.map((node) => ({
		id: node.id,
		label: node.label,
		checked: false,
		children: node.children ? buildTree(node.children) : undefined,
	}));
};

const Checkboxes = ({
	checkboxes,
	updateCheckboxes,
}: {
	checkboxes: Checkbox[];
	updateCheckboxes: (checkboxes: Checkbox[]) => void;
}) => {
	const updateCheckboxTree = (nodes: Checkbox[], targetId: number, isChecked: boolean): Checkbox[] => {
		return nodes.map((node) => {
			const updatedNode = { ...node };

			if (node.id === targetId) {
				updatedNode.checked = isChecked;
				if (updatedNode.children) {
					updatedNode.children = toggleChildren(updatedNode.children, isChecked);
				}
			} else if (node.children) {
				updatedNode.children = updateCheckboxTree(node.children, targetId, isChecked);
			}

			if (updatedNode.children) {
				const allChecked = updatedNode.children.every((child) => child.checked);
				updatedNode.checked = allChecked;
			}

			return updatedNode;
		});
	};

	const toggleChildren = (nodes: Checkbox[], isChecked: boolean): Checkbox[] => {
		return nodes.map((node) => ({
			...node,
			checked: isChecked,
			children: node.children ? toggleChildren(node.children, isChecked) : undefined,
		}));
	};

	const handleCheckboxChange = (id: number, isChecked: boolean) => {
		const updatedTree = updateCheckboxTree(checkboxes, id, isChecked);
		updateCheckboxes(updatedTree);
	};
	const renderCheckboxes = (nodes: Checkbox[]) => {
		return nodes?.map((node: Checkbox) => (
			<div key={node.id} className="w-full ml-3">
				<input
					type="checkbox"
					name={node.label}
					id={`checkbox-${node.id}`}
					checked={node.checked}
					onChange={(e) => handleCheckboxChange(node.id, e.target.checked)}
				/>
				<label htmlFor={`checkbox-${node.id}`} className="ml-3">
					{node.label}
				</label>
				{node.children && renderCheckboxes(node.children)}
			</div>
		));
	};

	return renderCheckboxes(checkboxes);
};

const NestedCheckbox = () => {
	const [checkboxes, setCheckboxes] = useState<Checkbox[]>(buildTree(CheckboxesData));

	return (
		<div className="p-6 w-1/3 mx-auto flex flex-col justify-center items-center">
			<h1 className="text-4xl py-10">Nested Checkbox</h1>
			<Checkboxes checkboxes={checkboxes} updateCheckboxes={setCheckboxes} />
		</div>
	);
};

export default NestedCheckbox;
