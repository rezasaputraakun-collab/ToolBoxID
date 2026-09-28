import { useEffect, useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import { Link } from "react-router-dom"

const menuItems = [
	{ label: "Home", to: "/#home" },
	{ label: "Popular Tools", to: "/#popular-tools" },
	{ label: "Categories", to: "/#categories" },
	{ label: "All Tools", to: "/#all-tools" },
	{ label: "About", to: "/about#about" },
	{ label: "Contact", to: "/contact#contact" },
]

function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	useEffect(() => {
		function closeOnEscape(event) {
			if (event.key === "Escape") setIsMenuOpen(false)
		}

		document.addEventListener("keydown", closeOnEscape)
		return () => document.removeEventListener("keydown", closeOnEscape)
	}, [])

	function renderLinks(className, linkClassName) {
		return (
			<ul className={className}>
				{menuItems.map(({ label, to }) => (
					<li key={label}>
						<Link
							to={to}
							onClick={() => setIsMenuOpen(false)}
							className={linkClassName}
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		)
	}

	return (
		<nav className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-[#dbe7fb] py-4 text-[#20271f]">
			<Link to="/#home" className="flex min-w-0 shrink-0 items-center gap-2" onClick={() => setIsMenuOpen(false)}>
				<img className="block h-8 w-24 object-contain sm:w-28 md:h-10 md:w-32" src="/ToolBox-removebg-preview.png" alt="" />
				<span className="bg-linear-to-r from-[#60a5fa] to-[#1d4ed8] bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
					ToolBoxID
				</span>
			</Link>

			{renderLinks(
				"ml-auto hidden items-center gap-x-0.5 text-sm font-medium text-[#50594b] md:flex",
				"inline-flex min-h-10 items-center whitespace-nowrap px-2 transition-colors hover:bg-[#eff6ff] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]",
			)}

			<button
				type="button"
				className="ml-auto inline-flex size-10 shrink-0 items-center justify-center text-xl text-[#20271f] hover:bg-[#eff6ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa] md:hidden"
				aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
				aria-expanded={isMenuOpen}
				aria-controls="mobile-navigation"
				onClick={() => setIsMenuOpen((open) => !open)}
			>
				{isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
			</button>

			{isMenuOpen && (
				<div id="mobile-navigation" className="w-full border-t border-[#dbe7fb] pt-2 md:hidden">
					{renderLinks(
						"grid grid-cols-1 gap-1 text-sm font-medium text-[#50594b]",
						"flex min-h-11 items-center px-3 hover:bg-[#eff6ff] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-[#60a5fa]",
					)}
				</div>
			)}
		</nav>
	)
}

export default Navbar