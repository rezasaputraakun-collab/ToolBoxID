import { useState } from "react"
import { FiCode, FiCopy, FiRefreshCw } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

function encodeBase64(value) {
	const bytes = new TextEncoder().encode(value)
	let binary = ""
	for (let offset = 0; offset < bytes.length; offset += 0x8000) {
		binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
	}
	return btoa(binary)
}

function decodeBase64(value) {
	const binary = atob(value.replace(/\s+/gu, ""))
	const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
	return new TextDecoder("utf-8", { fatal: true }).decode(bytes)
}

function Base64Encoder() {
	const [mode, setMode] = useState("encode")
	const [input, setInput] = useState("")
	const [result, setResult] = useState("")
	const [status, setStatus] = useState("")
	const [error, setError] = useState("")

	function processInput() {
		setError("")
		setStatus("")
		if (!input.trim()) {
			setError("Enter text before processing.")
			setResult("")
			return
		}

		try {
			setResult(mode === "encode" ? encodeBase64(input) : decodeBase64(input))
			setStatus(mode === "encode" ? "Text encoded successfully." : "Base64 decoded successfully.")
		} catch {
			setResult("")
			setError("Invalid Base64 input or unsupported text encoding.")
		}
	}

	async function copyResult() {
		try {
			await navigator.clipboard.writeText(result)
			setStatus("Result copied to clipboard.")
		} catch {
			setError("Clipboard access is unavailable in this browser.")
		}
	}

	function clearInput() {
		setInput("")
		setResult("")
		setStatus("")
		setError("")
	}

	return (
		<ToolPageLayout title="Base64 Encoder & Decoder" description="A simple interface for working with Base64 text." Icon={FiCode}>
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Base64 input">
					<fieldset>
						<legend className="mb-3 text-sm font-medium text-[#20271f]">Choose mode</legend>
						<div className="inline-flex border border-[#dbe7fb] p-1">
							<button type="button" onClick={() => setMode("encode")} aria-pressed={mode === "encode"} className={`min-h-10 px-4 text-sm font-semibold ${mode === "encode" ? "bg-[#eff6ff] text-[#1d4ed8]" : "text-[#5d665f] hover:bg-[#f7faff]"}`}>Encode</button>
							<button type="button" onClick={() => setMode("decode")} aria-pressed={mode === "decode"} className={`min-h-10 px-4 text-sm font-medium ${mode === "decode" ? "bg-[#eff6ff] text-[#1d4ed8]" : "text-[#5d665f] hover:bg-[#f7faff]"}`}>Decode</button>
						</div>
					</fieldset>
				<label htmlFor="base64-input" className="mb-3 mt-5 block text-sm font-medium text-[#20271f]">Input text</label>
				<textarea id="base64-input" rows={11} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter text to encode or decode..." className="w-full resize-y border border-[#dbe7fb] px-4 py-3 font-mono text-sm leading-6 text-[#20271f] outline-none placeholder:font-sans placeholder:text-[#788071] focus:border-[#60a5fa]" />
				<div className="mt-4 flex flex-wrap gap-3">
					<button type="button" onClick={processInput} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]"><FiRefreshCw aria-hidden="true" />Process</button>
					<button type="button" onClick={clearInput} className="min-h-11 border border-[#dbe7fb] px-5 text-sm font-medium text-[#20271f] hover:bg-[#f7faff]">Clear</button>
				</div>
				{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
			</section>

			<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Base64 result">
				<div className="mb-3 flex items-center justify-between gap-3">
					<h2 className="text-sm font-medium text-[#20271f]">Result</h2>
					<button type="button" onClick={copyResult} disabled={!result} className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#dbe7fb] px-3 text-sm text-[#5275b7] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"><FiCopy aria-hidden="true" />Copy</button>
				</div>
				<div className="min-h-64 whitespace-pre-wrap break-all border border-[#dbe7fb] bg-[#f7faff] p-4 font-mono text-sm leading-6 text-[#5d665f]">{result || "Your result will appear here."}</div>
				{status && <p role="status" className="mt-3 text-sm text-[#28734a]">{status}</p>}
			</section>
		</div>
		</ToolPageLayout>
	)
}

export default Base64Encoder
