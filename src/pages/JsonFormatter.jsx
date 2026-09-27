import { useState } from "react"
import { FiCode, FiCopy, FiFileText } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

const sampleJson = '{\n  "name": "Digital Toolbox",\n  "tools": 10,\n  "available": true\n}'

function JsonFormatter() {
	const [input, setInput] = useState(sampleJson)
	const [result, setResult] = useState(sampleJson)
	const [status, setStatus] = useState("Valid JSON")
	const [message, setMessage] = useState("")

	function formatJson(space) {
		try {
			const parsed = JSON.parse(input)
			const formatted = JSON.stringify(parsed, null, space)
			setResult(formatted)
			setStatus("Valid JSON")
			setMessage("")
		} catch (error) {
			setResult("")
			setStatus("Invalid JSON")
			setMessage(error.message)
		}
	}

	async function copyResult() {
		try {
			await navigator.clipboard.writeText(result)
			setMessage("Result copied to clipboard.")
		} catch {
			setMessage("Clipboard access is unavailable in this browser.")
		}
	}

	function clearJson() {
		setInput("")
		setResult("")
		setStatus("Ready")
		setMessage("")
	}

	return (
		<ToolPageLayout title="JSON Formatter" description="Format and inspect JSON with a clean, readable layout." Icon={FiCode}>
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="JSON editor">
					<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
						<label htmlFor="json-input" className="text-sm font-medium text-[#20271f]">Input JSON</label>
						<span className={`inline-flex items-center gap-2 text-sm ${status === "Valid JSON" ? "text-[#28734a]" : status === "Invalid JSON" ? "text-red-700" : "text-[#5d665f]"}`}><span className={`size-2 ${status === "Valid JSON" ? "bg-[#46a66c]" : status === "Invalid JSON" ? "bg-red-600" : "bg-[#9bb7e6]"}`} />{status}</span>
					</div>
					<textarea id="json-input" rows={13} value={input} onChange={(event) => { setInput(event.target.value); setStatus("Ready"); setMessage("") }} spellCheck="false" className="w-full resize-y border border-[#dbe7fb] bg-[#fbfdff] px-4 py-3 font-mono text-sm leading-6 text-[#20271f] outline-none focus:border-[#60a5fa]" />
					<div className="mt-4 flex flex-wrap gap-3">
						<button type="button" onClick={() => formatJson(2)} className="min-h-11 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]">Format JSON</button>
						<button type="button" onClick={() => formatJson(0)} className="min-h-11 border border-[#dbe7fb] px-5 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff]">Minify JSON</button>
						<button type="button" onClick={clearJson} className="min-h-11 border border-[#dbe7fb] px-5 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff]">Clear</button>
					</div>
				</section>

				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Formatted JSON result">
					<div className="mb-3 flex items-center justify-between gap-3">
						<h2 className="text-sm font-medium text-[#20271f]">Result</h2>
						<button type="button" onClick={copyResult} disabled={!result} className="inline-flex min-h-9 items-center justify-center gap-2 border border-[#dbe7fb] px-3 text-sm text-[#5275b7] transition-colors hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"><FiCopy aria-hidden="true" />Copy</button>
					</div>
					<pre className="min-h-64 overflow-auto border border-[#dbe7fb] bg-[#f7faff] p-4 font-mono text-sm leading-6 text-[#394334]">{result || "Result will appear here."}</pre>
					<p role="status" className={`mt-3 flex items-center gap-2 text-sm ${status === "Invalid JSON" ? "text-red-700" : "text-[#28734a]"}`}><FiFileText aria-hidden="true" />Status: {status}</p>
					{message && <p role="alert" className="mt-2 text-sm text-red-700">{message}</p>}
				</section>
			</div>
		</ToolPageLayout>
	)
}

export default JsonFormatter
