import {
	FiCode,
	FiFileText,
	FiHash,
	FiImage,
	FiStar,
	FiType,
	FiVideo,
} from "react-icons/fi"
import { Link } from "react-router-dom"
import toolSearchData from "../data/toolSearchData"

const popularRoutes = [
	"/tools/compress-image",
	"/tools/jpg-to-pdf",
	"/tools/qr-generator",
	"/tools/word-counter",
	"/tools/json-formatter",
	"/tools/video-to-audio",
	"/tools/compress-video",
	"/tools/barcode-generator",
]

const categoryIcons = {
	image: FiImage,
	pdf: FiFileText,
	utility: FiHash,
	text: FiType,
	developer: FiCode,
	media: FiVideo,
}

function PopulerTools() {
	const popularTools = popularRoutes
		.map((route) => toolSearchData.find((tool) => tool.route === route))
		.filter(Boolean)

	return (
		<section id="popular-tools" className="bg-[#f7faff] px-6 py-20 md:px-10 md:py-24">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex items-center gap-3">
					<FiStar aria-hidden="true" className="text-2xl text-[#2563eb]" />
					<h2 className="text-3xl font-semibold text-[#20271f] md:text-4xl">
						Popular Tools
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{popularTools.map((tool) => {
						const CategoryIcon = categoryIcons[tool.categorySlug]

						return (
							<Link
								key={tool.route}
								to={tool.route}
								className="block min-h-44 border border-[#dbe7fb] bg-white p-6 transition-colors hover:border-[#93b4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
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