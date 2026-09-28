import {
	FiCode,
	FiFileText,
	FiImage,
	FiTool,
	FiType,
	FiVideo,
} from "react-icons/fi"
import { Link } from "react-router-dom"
import { toolCategories } from "../data/toolSearchData"

const categoryIcons = {
	image: FiImage,
	media: FiVideo,
	pdf: FiFileText,
	text: FiType,
	developer: FiCode,
	utility: FiTool,
}

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
					{toolCategories.filter(({ showInCategories = true }) => showInCategories).map(({ name, slug, description, icon }) => {
						const Icon = categoryIcons[icon]

						return (
							<Link
								key={slug}
								to={`/?category=${slug}#all-tools`}
								className="block min-h-44 border border-[#dbe7fb] bg-white p-6 transition-colors hover:border-[#93b4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
							>
								<Icon aria-hidden="true" className="text-2xl text-[#2563eb]" />
								<h3 className="mt-4 text-xl font-semibold text-[#20271f]">
									{name}
								</h3>
								<p className="mt-2 text-sm leading-6 text-[#5d665f]">
									{description}
								</p>
							</Link>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default Categories