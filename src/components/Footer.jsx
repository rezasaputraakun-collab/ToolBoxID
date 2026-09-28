import { Link } from "react-router-dom"
import { FiGithub, FiGlobe, FiInstagram, FiLinkedin } from "react-icons/fi"
import { toolCategories } from "../data/toolSearchData"

const socialLinks = {
	linkedin: "https://github.com/rezasaputraakun-collab",
	instagram: "https://www.instagram.com/_forcuss?stkn=MXJuMW1uMGEzeTJpcg==",
	github: "https://github.com/USERNAME",
	portfolio: "/",
}

const socialItems = [
	{ label: "LinkedIn", href: socialLinks.linkedin, Icon: FiLinkedin },
	{ label: "Instagram", href: socialLinks.instagram, Icon: FiInstagram },
	{ label: "GitHub", href: socialLinks.github, Icon: FiGithub },
	{ label: "Portfolio", href: socialLinks.portfolio, Icon: FiGlobe },
]

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
		links: toolCategories.map(({ name, slug }) => ({
			label: name,
			to: `/?category=${slug}#category-${slug}`,
		})),
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
				<div className="grid grid-cols-2 gap-x-8 gap-y-10 border-b border-white/15 py-14 md:grid-cols-5 md:py-16">
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

					<section aria-labelledby="find-me-heading">
						<h3 id="find-me-heading" className="text-sm font-semibold text-white">
							Find Me
						</h3>
						<ul className="mt-4 flex flex-wrap gap-2">
							{socialItems.map(({ label, href, Icon }) => (
								<li key={label}>
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={label}
										className="inline-flex size-10 items-center justify-center text-lg text-white/65 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
									>
										<Icon aria-hidden="true" />
									</a>
								</li>
							))}
						</ul>
					</section>
				</div>

				<p className="py-6 text-sm text-white/55">
					© 2026 Digital Toolbox. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export default Footer
