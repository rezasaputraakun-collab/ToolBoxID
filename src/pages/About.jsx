import {
	FiCode,
	FiDroplet,
	FiFileText,
	FiImage,
	FiTool,
	FiType,
} from "react-icons/fi"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const categories = [
	{ name: "Image Tools", Icon: FiImage },
	{ name: "PDF Tools", Icon: FiFileText },
	{ name: "Text Tools", Icon: FiType },
	{ name: "Developer Tools", Icon: FiCode },
	{ name: "Design & Color Tools", Icon: FiDroplet },
	{ name: "Utility Tools", Icon: FiTool },
]

function About() {
	return (
		<div className="min-h-screen bg-white text-[#20271f]">
			<header className="mx-auto max-w-7xl px-6 md:px-10">
				<Navbar />
			</header>

			<main id="home">
				<section className="bg-white px-6 py-16 text-center md:px-10 md:py-20">
					<div className="mx-auto max-w-4xl">
						<h1 className="bg-linear-to-r from-white via-[#60a5fa] to-[#1d4ed8] bg-clip-text font-serif text-5xl leading-tight text-transparent drop-shadow-[0_2px_5px_rgba(37,99,235,0.55)] sm:text-6xl md:text-7xl">
							About Digital ToolboxID
						</h1>
						<p className="mt-5 text-lg text-[#394334] md:text-xl">
							Simple tools for everyday tasks.
						</p>
						<p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-[#5d665f] md:text-lg">
							Digital Toolbox brings together simple, practical online tools to make
							everyday digital tasks quicker and easier. Work with images, PDFs, text,
							and more, all from one convenient place.
						</p>
					</div>
				</section>

				<section id="about" className="bg-[#f7faff] px-6 py-14 md:px-10 md:py-16">
					<div className="mx-auto max-w-7xl">
						<div className="max-w-3xl">
							<h2 className="text-3xl font-semibold text-[#20271f] md:text-4xl">
								Our Mission
							</h2>
							<p className="mt-4 text-base leading-7 text-[#5d665f] md:text-lg">
								Our mission is to make useful digital tools easy to find and simple to
								use, so everyday tasks take less time and effort.
							</p>
						</div>
					</div>
				</section>

				<section className="px-6 py-14 md:px-10 md:py-16">
					<div className="mx-auto max-w-7xl">
						<div className="mb-8 max-w-3xl">
							<h2 className="text-3xl font-semibold text-[#20271f] md:text-4xl">
								What We Offer
							</h2>
							<p className="mt-3 text-base leading-7 text-[#5d665f]">
								A growing collection of handy tools, organized around the tasks you
								need to get done.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{categories.map(({ name, Icon }) => (
								<article
									key={name}
									className="min-h-32 border border-[#dbe7fb] bg-white p-6 transition-colors hover:border-[#93b4f5]"
								>
									<Icon aria-hidden="true" className="text-2xl text-[#2563eb]" />
									<h3 className="mt-4 text-lg font-semibold text-[#20271f]">
										{name}
									</h3>
								</article>
							))}
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default About
