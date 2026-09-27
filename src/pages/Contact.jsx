import { useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function Contact() {
	const [isSubmitted, setIsSubmitted] = useState(false)

	function handleSubmit(event) {
		event.preventDefault()
		setIsSubmitted(true)
	}

	return (
		<div className="min-h-screen bg-white text-[#20271f]">
			<header className="mx-auto max-w-7xl px-6 md:px-10">
				<Navbar />
			</header>

			<main id="home">
				<section className="bg-white px-6 py-14 text-center md:px-10 md:py-16">
					<div className="mx-auto max-w-4xl">
						<h1 className="bg-linear-to-r from-white via-[#60a5fa] to-[#1d4ed8] bg-clip-text font-serif text-5xl leading-tight text-transparent drop-shadow-[0_2px_5px_rgba(37,99,235,0.55)] sm:text-6xl md:text-7xl">
							Contact Us
						</h1>
						<p className="mt-5 text-lg text-[#394334] md:text-xl">
							Have a question or feedback? We'd love to hear from you.
						</p>
					</div>
				</section>

				<section id="contact" className="bg-[#f7faff] px-6 py-12 md:px-10 md:py-16">
					<div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)] lg:gap-12">
						<form
							className="border border-[#dbe7fb] bg-white p-6 sm:p-8"
							onSubmit={handleSubmit}
						>
							<div className="space-y-5">
								<div>
									<label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#20271f]">
										Name
									</label>
									<input
										id="contact-name"
										name="name"
										type="text"
										autoComplete="name"
										minLength={2}
										maxLength={100}
										required
										className="min-h-12 w-full border border-[#dbe7fb] px-4 text-base text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]"
										placeholder="Your name"
									/>
								</div>

								<div>
									<label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[#20271f]">
										Email
									</label>
									<input
										id="contact-email"
										name="email"
										type="email"
										autoComplete="email"
										maxLength={254}
										required
										className="min-h-12 w-full border border-[#dbe7fb] px-4 text-base text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]"
										placeholder="you@example.com"
									/>
								</div>

								<div>
									<label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#20271f]">
										Message
									</label>
									<textarea
										id="contact-message"
										name="message"
										minLength={10}
										maxLength={2000}
										required
										rows={6}
										className="w-full resize-y border border-[#dbe7fb] px-4 py-3 text-base leading-6 text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]"
										placeholder="How can we help?"
									/>
								</div>
							</div>

							<button
								type="submit"
								className="mt-6 min-h-12 bg-[#1d4ed8] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
							>
								Send Message
							</button>

							{isSubmitted && (
								<p role="status" className="mt-4 text-sm leading-6 text-[#394334]">
									Thanks for reaching out. This demo form doesn't send messages yet.
								</p>
							)}
						</form>

						<aside className="border border-[#dbe7fb] bg-white p-6 sm:p-8">
							<h2 className="text-2xl font-semibold text-[#20271f]">
								Get in touch
							</h2>
							<p className="mt-4 text-base leading-7 text-[#5d665f]">
								Have a question, found an issue, or have an idea for a tool? Share the
								details in the form and help us understand what you need.
							</p>
							<p className="mt-5 text-sm leading-6 text-[#5d665f]">
								Please note: messages are not sent or stored yet.
							</p>
						</aside>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default Contact
