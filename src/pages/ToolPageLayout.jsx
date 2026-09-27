import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function ToolPageLayout({ title, description, Icon, children }) {
	return (
		<div className="min-h-screen bg-white text-[#20271f]">
			<header className="mx-auto max-w-7xl px-6 md:px-10">
				<Navbar />
			</header>

			<main id="home">
				<section className="bg-white px-6 py-12 md:px-10 md:py-16">
					<div className="mx-auto max-w-6xl">
						<div className="mb-8 text-center">
							<div className="mx-auto mb-4 flex size-12 items-center justify-center bg-[#eff6ff] text-[#2563eb]">
								<Icon aria-hidden="true" className="text-2xl" />
							</div>
							<h1 className="bg-linear-to-r from-white via-[#60a5fa] to-[#1d4ed8] bg-clip-text font-serif text-5xl leading-tight text-transparent drop-shadow-[0_2px_5px_rgba(37,99,235,0.55)] sm:text-6xl md:text-7xl">
								{title}
							</h1>
							<p className="mt-4 text-base text-[#394334] md:text-lg">
								{description}
							</p>
						</div>
						{children}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default ToolPageLayout
