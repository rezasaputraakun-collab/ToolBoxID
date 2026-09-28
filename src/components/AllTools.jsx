import {
	FiCode,
	FiFileText,
	FiHash,
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

const toolIcons = {
	image: FiImage,
	media: FiVideo,
	pdf: FiFileText,
	text: FiType,
	developer: FiCode,
	utility: FiHash,
}

function AllTools({ selectedCategory = "" }) {
	const categories = selectedCategory
		? toolCategories.filter(({ slug }) => slug === selectedCategory)
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
					{selectedCategory && (
						<Link
							to="/#all-tools"
							className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-[#1d4ed8] underline underline-offset-4"
						>
							Show all tools
						</Link>
					)}
				</div>

				<div className="space-y-12">
					{categories.map(({ name, slug, icon, tools }) => {
						const CategoryIcon = categoryIcons[icon]

						return (
							<section key={slug} id={`category-${slug}`} aria-label={name}>
								<div className="mb-5 flex items-center gap-3">
									<CategoryIcon aria-hidden="true" className="text-xl text-[#2563eb]" />
									<h3 className="text-2xl font-semibold text-[#20271f]">{name}</h3>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{tools.map(({ name: toolName, description, route, available = true }) => {
										const ToolIcon = toolIcons[icon] || FiHash
										const cardClassName = "block min-h-36 border border-[#dbe7fb] bg-white p-5 transition-colors"

										const content = (
											<>
												<ToolIcon aria-hidden="true" className="text-xl text-[#5275b7]" />
												<h4 className="mt-3 text-lg font-semibold text-[#20271f]">
													{toolName}
												</h4>
												<p className="mt-2 text-sm leading-6 text-[#5d665f]">
													{description}
												</p>
												{!available && (
													<span className="mt-3 inline-block text-xs font-semibold uppercase text-[#5275b7]">
														Coming soon
													</span>
												)}
											</>
										)

										return route && available ? (
											<Link
												key={toolName}
												to={route}
												className={`${cardClassName} hover:border-[#93b4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]`}
											>
												{content}
											</Link>
										) : (
											<article key={toolName} className={`${cardClassName} border-dashed`}>
												{content}
												</article>
										)
									})}
								</div>
							</section>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default AllTools