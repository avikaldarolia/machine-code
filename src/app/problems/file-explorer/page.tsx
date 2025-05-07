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

	const toggleHelper = (fileIterator: File[], fileId: number, operation: CollapsedStatus): boolean => {
		const updatedItr = [...fileIterator];
		let found = false;
		updatedItr.forEach((ff) => {
			if (found === true) {
				return;
			}
			if (ff.id === fileId) {
				found = true;
				if (operation === CollapsedStatus.OPEN) {
					ff.collapsed = false;
				} else if (operation === CollapsedStatus.CLOSE) {
					ff.collapsed = true;
				}
				return true;
			}

			if (ff.children && ff.children.length > 0) {
				if (toggleHelper(ff.children, fileId, operation)) {
					found = true;
					return true;
				}
			}

			return false;
		});

		return found;
	};

	const handleToggle = (fileId: number, operation: CollapsedStatus) => {
		const updatedFiles = [...files];
		toggleHelper(updatedFiles, fileId, operation);
		setFiles(() => updatedFiles);
	};

	const handleAddition = (fileIterator: File[]) => {
		if (fileIterator.length === 0) {
			return false;
		}

		const updatedItr = [...fileIterator];
		let found = false;
		updatedItr.forEach((ff) => {
			if (found === true) {
				return;
			}
			if (ff.id === fileId) {
				found = true;
				const child: File = {
					id: Date.now(),
					name: input,
					isFolder: type === FolderType.FOLDER,
				};

				if (type === FolderType.FOLDER) {
					child.children = [];
					child.collapsed = true;
				}

				if (!ff.children) {
					ff.children = [];
				}
				ff.children = [...ff.children, child];
				return true;
			}

			if (ff.children && ff.children.length > 0) {
				const bottomCheck = handleAddition(ff.children);
				if (bottomCheck) {
					found = true;
				}
				return bottomCheck;
			}

			return false;
		});

		setFiles(() => updatedItr);
		setInput("");
		setFileId(null);
		setType(null);
	};

	const deleteHelper = (fileIterator: File[], fileId: number): boolean => {
		let found = false;
		if (fileIterator.length === 0) {
			return false;
		}

		fileIterator.forEach((file, idx) => {
			if (file.id === fileId) {
				found = true;
				fileIterator.splice(idx, 1);
				return null;
			}

			if (file.children && deleteHelper(file.children, fileId)) {
				found = true;
				return true;
			}

			return false;
		});

		return found;
	};

	const handleDelete = (fileId: number) => {
		const updatedFiles = [...files];
		deleteHelper(updatedFiles, fileId);
		setFiles(updatedFiles);
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
						handleAddition(files);
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
