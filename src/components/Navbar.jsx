import { Link, useLocation } from "react-router-dom"

function Navbar() {
    const { pathname } = useLocation()
    const isAboutPage = pathname === "/about"
    const isContactPage = pathname === "/contact"
    const menuItems = [
        { label: "Home", to: "/#home" },
        { label: "Tools", to: "/#popular-tools" },
        { label: "Categories", to: "/#categories" },
        { label: "About", to: isAboutPage ? "#about" : "/about" },
        { label: "Contact", to: isContactPage ? "#contact" : "/contact" },
    ]

    return (
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dbe7fb] py-5 text-[#20271f]">
            <Link to="/#home" className="group flex items-center gap-3">
                <span className="flex shrink-0 items-center">
                    <img className="navbar-logo" src="/ToolBox-removebg-preview.png" alt="Digital Toolbox" />
                </span>
                <span className="bg-linear-to-r from-[#60a5fa] to-[#1d4ed8] bg-clip-text text-2xl font-bold text-transparent">
                    ToolboxID
                </span>
            </Link>
            <ul className="ml-auto flex flex-wrap items-center justify-end gap-x-2 gap-y-2 text-sm font-medium text-[#50594b]">
                {menuItems.map(({ label, to }) => (
                    <li key={label}>
                        <Link
                            to={to}
                            className="inline-flex min-h-10 items-center px-3 transition-colors hover:bg-[#eff6ff] hover:text-[#1d4ed8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
export default Navbar