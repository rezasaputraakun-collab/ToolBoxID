import { useState } from "react"
import { FiHash } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

const statistics = ["Character Count", "Character Count Without Spaces", "Word Count"]

function CharacterCounter() {
	const [text, setText] = useState("")
	const values = [
		Array.from(text).length,
		Array.from(text.replace(/\s/gu, "")).length,
		text.trim() ? text.trim().split(/\s+/u).length : 0,
	]

	return (
		<ToolPageLayout title="Character Counter" description="Count characters and words in any text." Icon={FiHash}>
			<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Text input">
				<label htmlFor="character-counter-text" className="mb-3 block text-sm font-medium text-[#20271f]">Your text</label>
				<textarea id="character-counter-text" rows={10} value={text} onChange={(event) => setText(event.target.value)} placeholder="Type or paste your text here..." className="w-full resize-y border border-[#dbe7fb] px-4 py-3 text-base leading-6 text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]" />
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

export default CharacterCounter
