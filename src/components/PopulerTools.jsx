import {
	FiCode,
	FiDroplet,
	FiFileText,
	FiHash,
	FiImage,
	FiStar,
	FiType,
} from "react-icons/fi"
import { Link } from "react-router-dom"

const categoryIcons = {
	Image: FiImage,
	PDF: FiFileText,
	Generator: FiHash,
	Text: FiType,
	Developer: FiCode,
	Color: FiDroplet,
}

const popularTools = [
	{
		name: "Compress Image",
		route: "/tools/compress-image",
		category: "Image",
		description: "Make image files smaller while keeping them clear.",
	},
	{
		name: "JPG to PDF",
		route: "/tools/jpg-to-pdf",
		category: "PDF",
		description: "Convert JPG images into a single PDF file.",
	},
	{
		name: "QR Code Generator",
		route: "/tools/qr-generator",
		category: "Generator",
		description: "Create QR codes for links and short text.",
	},
	{
		name: "Word Counter",
		route: "/tools/word-counter",
		category: "Text",
		description: "Get a quick word count for any text.",
	},
	{
		name: "JSON Formatter",
		route: "/tools/json-formatter",
		category: "Developer",
		description: "Format JSON for easier reading.",
	},
	{
		name: "Color Converter",
		route: "/tools/color-converter",
		category: "Color",
		description: "Convert colors between HEX, RGB, and HSL.",
	},
]

function PopulerTools() {
	return (
		<section id="popular-tools" className="bg-[#f7faff] px-6 py-20 md:px-10 md:py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex items-center gap-3">
					<FiStar aria-hidden="true" className="text-2xl text-[#2563eb]" />
					<h2 className="text-3xl font-semibold text-[#20271f] md:text-4xl">
						Populer Tools
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{popularTools.map((tool) => {
						const CategoryIcon = categoryIcons[tool.category]

						return (
							<Link
								key={tool.name}
								to={tool.route}
								className="block min-h-44 border border-[#dbe7fb] bg-white p-6 transition-colors hover:border-[#93b4f5]"
							>
								<p className="flex items-center gap-2 text-xs font-semibold uppercase text-[#5275b7]">
									<CategoryIcon aria-hidden="true" className="text-base" />
									{tool.category}
								</p>
								<h3 className="mt-3 text-xl font-semibold text-[#20271f]">
									{tool.name}
							</h3>
							<p className="mt-2 text-sm leading-6 text-[#5d665f]">
								{tool.description}
							</p>
							</Link>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default PopulerTools
