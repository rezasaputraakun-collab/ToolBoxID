import {
	FiCode,
	FiDroplet,
	FiFileText,
	FiImage,
	FiTool,
	FiType,
} from "react-icons/fi"

const categories = [
	{
		name: "Image Tools",
		description: "Compress, resize, and convert your images.",
		Icon: FiImage,
	},
	{
		name: "PDF Tools",
		description: "Convert, organize, and manage PDF files.",
		Icon: FiFileText,
	},
	{
		name: "Text Tools",
		description: "Count, edit, and transform text with ease.",
		Icon: FiType,
	},
	{
		name: "Developer Tools",
		description: "Helpful utilities for code and data formats.",
		Icon: FiCode,
	},
	{
		name: "Utility Tools",
		description: "Simple everyday utilities, all in one place.",
		Icon: FiTool,
	},
	{
		name: "Design & Color Tools",
		description: "Explore colors and create polished designs.",
		Icon: FiDroplet,
	},
]

function Categories() {
	return (
		<section id="categories" className="bg-white px-6 py-20 md:px-10 md:py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10">
					<h2 className="text-3xl font-semibold text-[#20271f] md:text-4xl">
						Categories
					</h2>
					<p className="mt-3 text-base text-[#5d665f]">
						Explore our tools by category.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map(({ name, description, Icon }) => (
						<article
							key={name}
							className="min-h-44 border border-[#dbe7fb] bg-white p-6 transition-colors hover:border-[#93b4f5]"
						>
							<Icon aria-hidden="true" className="text-2xl text-[#2563eb]" />
							<h3 className="mt-4 text-xl font-semibold text-[#20271f]">
								{name}
							</h3>
							<p className="mt-2 text-sm leading-6 text-[#5d665f]">
								{description}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default Categories
