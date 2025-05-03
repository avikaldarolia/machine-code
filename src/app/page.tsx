import Link from "next/link";

const components = [
	{ name: "Machine Round 1", path: "/problems/AutoComplete" },
	// { name: "Machine Round 2", path: "/components/round-2" },
	// Add more rounds here
];

export default function Dashboard() {
	return (
		<main className="p-8">
			<h1 className="text-3xl font-bold mb-6 text-gray-800">
				Machine Round Components
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				{components.map((comp) => (
					<Link
						key={comp.name}
						href={comp.path}
						className="p-6 bg-white border border-gray-200 hover:border-blue-500 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
						<h2 className="text-xl font-semibold">{comp.name}</h2>
						<p className="text-sm text-gray-500 mt-2">
							View {comp.name} solution
						</p>
					</Link>
				))}
			</div>
		</main>
	);
}
