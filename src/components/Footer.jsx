import { Link } from "react-router-dom"

const footerGroups = [
	{
		title: "Tools",
		links: [
			{ label: "All Tools", to: "/#all-tools" },
			{ label: "Popular Tools", to: "/#popular-tools" },
		],
	},
	{
		title: "Categories",
		links: [
			{ label: "Image Tools", to: "/?category=image#category-image" },
			{ label: "PDF Tools", to: "/?category=pdf#category-pdf" },
			{ label: "Text Tools", to: "/?category=text#category-text" },
			{ label: "Developer Tools", to: "/?category=developer#category-developer" },
			{ label: "Design & Color Tools", to: "/?category=design-color#category-design-color" },
			{ label: "Utility Tools", to: "/?category=utility#category-utility" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", to: "/about#about" },
			{ label: "Contact", to: "/contact#contact" },
		],
	},
]

function Footer() {
	return (
		<footer className="bg-[#20271f] px-6 text-white md:px-10">
			<div className="mx-auto max-w-7xl">
				<div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-white/15 py-14 md:grid-cols-4 md:py-16">
					<div id="about" className="col-span-2 md:col-span-1">
						<Link to="/#home" className="text-xl font-semibold text-white">
							Digital Toolbox
						</Link>
						<p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
							Simple tools for everyday tasks.
						</p>
					</div>

					{footerGroups.map(({ title, links }) => (
						<nav
							key={title}
							aria-label={`${title} links`}
							id={title === "Company" ? "contact" : undefined}
						>
							<h3 className="text-sm font-semibold text-white">{title}</h3>
							<ul className="mt-4 space-y-3">
								{links.map(({ label, to }) => (
									<li key={label}>
										<Link
											to={to}
											className="text-sm text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-300"
										>
											{label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				<p className="py-6 text-sm text-white/55">
					© 2026 Digital Toolbox. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export default Footer
