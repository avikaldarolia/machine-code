"use client";
import React, { useState } from "react";

type File = {
	id: number;
	name: string;
	isFolder: boolean;
	collapsed?: boolean;
	children?: File[];
};

const initialData: File[] = [
	{
		id: 1,
		name: "public",
		isFolder: true,
		collapsed: false,
		children: [{ id: 2, name: "index.html", isFolder: false }],
	},
	{
		id: 3,
		name: "src",
		isFolder: true,
		collapsed: false,
		children: [
			{ id: 4, name: "App.js", isFolder: false },
			{ id: 5, name: "index.js", isFolder: false },
		],
	},
	{ id: 6, name: "package.json", isFolder: false },
];

enum CollapsedStatus {
	OPEN = "open",
	CLOSE = "close",
}

enum FolderType {
	FILE = "File",
	FOLDER = "Folder",
}

const FileExplorer = () => {
	const [files, setFiles] = useState<File[]>(initialData);
	const [input, setInput] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [fileId, setFileId] = useState<number | null>(null);
	const [type, setType] = useState<FolderType | null>(null);

	const updateTree = (nodes: File[], callback: (node: File, idx: number, parent: File[]) => boolean): File[] => {
		return nodes.map((node, idx, arr) => {
			if (callback(node, idx, arr)) {
				return node;
			}

			if (node.children) {
				node.children = updateTree(node.children, callback);
			}
			return node;
		});
	};

	const handleToggle = (id: number, status: CollapsedStatus) => {
		const updated = updateTree([...files], (node) => {
			if (node.id === id && node.isFolder) {
				node.collapsed = status === CollapsedStatus.CLOSE;
				return true;
			}
			return false;
		});

		setFiles(updated);
		setInput("");
	};

	const handleAddition = () => {
		if (!fileId || !type || input.trim() === "") return;

		const updated = updateTree([...files], (node) => {
			if (node.id === fileId && node.isFolder) {
				const newNode: File = {
					id: Date.now(),
					name: input.trim(),
					isFolder: type === FolderType.FOLDER,
					collapsed: type === FolderType.FOLDER ? true : undefined,
					children: type === FolderType.FOLDER ? [] : undefined,
				};
				node.children = node.children ? [...node.children, newNode] : [newNode];
				return true;
			}

			return false;
		});

		setFiles(updated);
		setInput("");
		setFileId(null);
		setType(null);
		setIsOpen(false);
	};

	const handleDelete = (id: number) => {
		const removeNode = (nodes: File[]): File[] =>
			nodes
				.map((node) => {
					if (node.id === id) {
						return null;
					}
					if (node.children) {
						node.children = removeNode(node.children);
					}
					return node;
				})
				.filter(Boolean) as File[];

		setFiles(removeNode([...files]));
	};

	const renderFolder = (file: File) => {
		return (
			<div key={file.id} className="ml-3 cursor-pointer flex flex-col gap-y-1">
				<div className="flex">
					{file.isFolder &&
						(file.collapsed ? (
							<button onClick={() => handleToggle(file.id, CollapsedStatus.OPEN)}>&#8595;</button>
						) : (
							<button onClick={() => handleToggle(file.id, CollapsedStatus.CLOSE)}>&#8593;</button>
						))}
					<p>{file.name}</p>
					<div className="px-2 text-sm flex justify-center items-center gap-0.5">
						{file.isFolder && (
							<>
								<button
									className="cursor-pointer border border-white px-1"
									onClick={() => {
										setFileId(file.id);
										setType(FolderType.FOLDER);
										setIsOpen(true);
									}}>
									+Folder
								</button>
								<button
									className="cursor-pointer border border-white px-1"
									onClick={() => {
										setFileId(file.id);
										setType(FolderType.FILE);
										setIsOpen(true);
									}}>
									+File
								</button>
							</>
						)}
						<button
							className="px-1 text-sm cursor-pointer border border-white"
							onClick={() => {
								handleDelete(file.id);
							}}>
							D
						</button>
					</div>
				</div>
				{!file.collapsed ? file.children && file.children.map((subfiles) => renderFolder(subfiles)) : null}
			</div>
		);
	};

	const Modal = (
		<div className="flex flex-col text-center justify-center w-1/3 mx-auto">
			<p>Add {type === FolderType.FOLDER ? "Folder" : "File"}</p>
			<input
				type="text"
				className=""
				placeholder="folder name..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<div className="flex w-full justify-center gap-x-2 items-center">
				<button
					className="my-2 w-full cursor-pointer bg-amber-600 px-2 text-black rounded-lg"
					onClick={() => {
						handleAddition();
						setIsOpen(false);
					}}>
					Add
				</button>
				<button
					className="my-2 w-full cursor-pointer bg-amber-200 px-2 text-black rounded-lg"
					onClick={() => setIsOpen(false)}>
					Cancel
				</button>
			</div>
		</div>
	);

	return (
		<div className="p-6 w-1/3 mx-auto flex flex-col justify-center items-center">
			<h1 className="text-4xl py-10">File Explorer</h1>
			<div className="py-10 -ml-3">{files?.map((file) => renderFolder(file))}</div>
			{isOpen && Modal}
		</div>
	);
};

export default FileExplorer;
