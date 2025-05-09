import Link from "next/link";

const components = [
	{ name: "Autocomplete", path: "/problems/autocomplete" },
	{ name: "File Explorer", path: "/problems/file-explorer" },
	{ name: "Nested Checkbox", path: "/problems/nested-checkbox" },
	// Add more rounds here
];

export default function Dashboard() {
	return (
		<main className="p-8">
			<h1 className="text-3xl text-center font-bold mb-6 text-white">Machine Round Components</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-black">
				{components.map((comp) => (
					<Link
						key={comp.name}
						href={comp.path}
						className="p-6 bg-white border border-gray-200 hover:border-blue-500 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
						<h2 className="text-xl font-semibold">{comp.name}</h2>
						<p className="text-sm mt-2">View {comp.name} solution</p>
					</Link>
				))}
			</div>
		</main>
	);
}
