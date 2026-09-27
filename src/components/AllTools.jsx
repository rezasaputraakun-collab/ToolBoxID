import {
	FiCode,
	FiDroplet,
	FiFileText,
	FiHash,
	FiImage,
	FiTool,
	FiType,
} from "react-icons/fi"
import { Link } from "react-router-dom"

const toolCategories = [
	{
		name: "Image Tools",
		Icon: FiImage,
		tools: [
			{
				name: "Compress Image",
				route: "/tools/compress-image",
				description: "Reduce image file size while keeping it clear.",
				Icon: FiImage,
			},
			{
				name: "Resize Image",
				route: "/tools/resize-image",
				description: "Resize an image to fit your needs.",
				Icon: FiImage,
			},
		],
	},
	{
		name: "PDF Tools",
		Icon: FiFileText,
		tools: [
			{
				name: "JPG to PDF",
				route: "/tools/jpg-to-pdf",
				description: "Convert JPG images into a PDF document.",
				Icon: FiFileText,
			},
			{
				name: "Merge PDF",
				route: "/tools/merge-pdf",
				description: "Combine multiple PDF files into one.",
				Icon: FiFileText,
			},
		],
	},
	{
		name: "Text Tools",
		Icon: FiType,
		tools: [
			{
				name: "Word Counter",
				route: "/tools/word-counter",
				description: "Count words in your text instantly.",
				Icon: FiType,
			},
			{
				name: "Character Counter",
				route: "/tools/character-counter",
				description: "Check the character count of any text.",
				Icon: FiHash,
			},
		],
	},
	{
		name: "Developer Tools",
		Icon: FiCode,
		tools: [
			{
				name: "JSON Formatter",
				route: "/tools/json-formatter",
				description: "Format JSON to make it easier to read.",
				Icon: FiCode,
			},
			{
				name: "Base64 Encoder",
				route: "/tools/base64",
				description: "Encode text into Base64 format.",
				Icon: FiHash,
			},
		],
	},
	{
		name: "Design & Color Tools",
		Icon: FiDroplet,
		tools: [
			{
				name: "Color Converter",
				route: "/tools/color-converter",
				description: "Convert colors between HEX, RGB, and HSL.",
				Icon: FiDroplet,
			},
			{
				name: "Color Palette Generator",
				route: "/tools/color-palette-generator",
				description: "Build a coordinated palette for your design.",
				Icon: FiDroplet,
			},
		],
	},
	{
		name: "Utility Tools",
		Icon: FiTool,
		tools: [
			{
				name: "QR Code Generator",
				route: "/tools/qr-generator",
				description: "Create a QR code for a link or text.",
				Icon: FiHash,
			},
			{
				name: "Unit Converter",
				route: "/tools/unit-converter",
				description: "Convert common units quickly and easily.",
				Icon: FiTool,
			},
		],
	},
]

const categorySlugs = {
	"Image Tools": "image",
	"PDF Tools": "pdf",
	"Text Tools": "text",
	"Developer Tools": "developer",
	"Design & Color Tools": "design-color",
	"Utility Tools": "utility",
}

function AllTools({ selectedCategory = "" }) {
	const visibleCategories = selectedCategory
		? toolCategories.filter(({ name }) => categorySlugs[name] === selectedCategory)
		: toolCategories

	return (
		<section id="all-tools" className="bg-[#f7faff] px-6 py-20 md:px-10 md:py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12">
					<h2 className="text-3xl font-semibold text-[#20271f] md:text-4xl">
						All Tools
					</h2>
					<p className="mt-3 text-base text-[#5d665f]">
						Browse all available tools, organized by category.
					</p>
				</div>

				<div className="space-y-12">
					{visibleCategories.map(({ name, Icon, tools }) => (
						<section key={name} id={`category-${categorySlugs[name]}`} aria-label={name}>
							<div className="mb-5 flex items-center gap-3">
								<Icon aria-hidden="true" className="text-xl text-[#2563eb]" />
								<h3 className="text-2xl font-semibold text-[#20271f]">{name}</h3>
							</div>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{tools.map(({ name: toolName, description, Icon: ToolIcon, route }) => (
									<Link
										key={toolName}
										to={route}
										className="block min-h-36 border border-[#dbe7fb] bg-white p-5 transition-colors hover:border-[#93b4f5]"
									>
										<ToolIcon aria-hidden="true" className="text-xl text-[#5275b7]" />
										<h4 className="mt-3 text-lg font-semibold text-[#20271f]">
											{toolName}
										</h4>
										<p className="mt-2 text-sm leading-6 text-[#5d665f]">
											{description}
										</p>
									</Link>
								))}
							</div>
						</section>
					))}
				</div>
			</div>
		</section>
	)
}

export default AllTools
