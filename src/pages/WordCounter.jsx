import { useState } from "react"
import { FiType } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

const statistics = ["Word Count", "Character Count", "Character Count Without Spaces", "Sentence Count", "Paragraph Count"]

function WordCounter() {
	const [text, setText] = useState("")
	const words = text.trim() ? text.trim().split(/\s+/u).length : 0
	const characters = Array.from(text).length
	const charactersWithoutSpaces = Array.from(text.replace(/\s/gu, "")).length
	const sentences = text.split(/[.!?]+/u).filter((sentence) => sentence.trim()).length
	const paragraphs = text.split(/\n\s*\n/u).filter((paragraph) => paragraph.trim()).length
	const values = [words, characters, charactersWithoutSpaces, sentences, paragraphs]

	return (
		<ToolPageLayout title="Word Counter" description="Count words, characters, sentences, and paragraphs in your text." Icon={FiType}>
			<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Text input">
				<label htmlFor="word-counter-text" className="mb-3 block text-sm font-medium text-[#20271f]">Your text</label>
				<textarea id="word-counter-text" rows={10} value={text} onChange={(event) => setText(event.target.value)} placeholder="Type or paste your text here..." className="w-full resize-y border border-[#dbe7fb] px-4 py-3 text-base leading-6 text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]" />
				<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm text-[#5d665f]">Counts update as you type.</p>
					<button type="button" onClick={() => setText("")} className="inline-flex min-h-10 items-center justify-center border border-[#dbe7fb] px-4 text-sm font-medium text-[#20271f] transition-colors hover:bg-[#f7faff]">Clear</button>
				</div>
			</section>

			<section className="mt-6" aria-label="Text statistics">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{statistics.map((label, index) => (
						<div key={label} className="min-h-28 border border-[#dbe7fb] bg-white p-5">
							<p className="text-sm leading-5 text-[#5d665f]">{label}</p>
							<p className="mt-3 text-2xl font-semibold text-[#20271f]">{values[index]}</p>
						</div>
					))}
				</div>
			</section>
		</ToolPageLayout>
	)
}

export default WordCounter
