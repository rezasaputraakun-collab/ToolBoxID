import { useEffect, useRef, useState } from "react"
import { FiArrowDown, FiArrowUp, FiDownload, FiFileText, FiRefreshCw, FiTrash2, FiUploadCloud } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

function MergePdf() {
	const [files, setFiles] = useState([])
	const [pdfUrl, setPdfUrl] = useState("")
	const [isMerging, setIsMerging] = useState(false)
	const [error, setError] = useState("")
	const [status, setStatus] = useState("")
	const fileInputRef = useRef(null)
	const resultUrls = useRef(new Set())

	useEffect(() => () => resultUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])

	function addFiles(fileList) {
		const selected = Array.from(fileList)
		const invalid = selected.find((file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf"))
		if (invalid) {
			setError(`${invalid.name} is not a PDF file.`)
			return
		}
		clearResult()
		setFiles((current) => [...current, ...selected.map((file) => ({ id: crypto.randomUUID(), file }))])
		setError("")
		setStatus("")
	}

	function clearResult() {
		resultUrls.current.forEach((url) => URL.revokeObjectURL(url))
		resultUrls.current.clear()
		setPdfUrl("")
	}

	function removeFile(id) {
		setFiles((current) => current.filter((item) => item.id !== id))
		clearResult()
	}

	function moveFile(index, direction) {
		setFiles((current) => {
			const target = index + direction
			if (target < 0 || target >= current.length) return current
			const next = [...current]
			;[next[index], next[target]] = [next[target], next[index]]
			return next
		})
		clearResult()
	}

	async function mergePdfs() {
		if (files.length < 2) {
			setError("Add at least two PDF files to merge.")
			return
		}
		setIsMerging(true)
		setError("")
		setStatus("")
		try {
			const { PDFDocument } = await import("pdf-lib")
			const merged = await PDFDocument.create()
			for (const { file } of files) {
				const source = await PDFDocument.load(await file.arrayBuffer())
				const pages = await merged.copyPages(source, source.getPageIndices())
				pages.forEach((page) => merged.addPage(page))
			}
			const blob = new Blob([await merged.save()], { type: "application/pdf" })
			const url = URL.createObjectURL(blob)
			resultUrls.current.add(url)
			setPdfUrl(url)
			setStatus(`Merged ${files.length} PDF files successfully.`)
		} catch {
			setError("One or more files could not be read as valid PDFs.")
		} finally {
			setIsMerging(false)
		}
	}

	function resetTool() {
		clearResult()
		setFiles([])
		setError("")
		setStatus("")
	}

	return (
		<ToolPageLayout title="Merge PDF" description="Combine multiple PDF files into one organized document." Icon={FiFileText}>
			<div className="space-y-6">
				<div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }} className="border border-dashed border-[#b9cbea] bg-[#f7faff] p-8 text-center sm:p-10">
					<FiUploadCloud aria-hidden="true" className="mx-auto text-4xl text-[#2563eb]" />
					<p className="mt-4 text-base font-medium text-[#20271f]">Drag &amp; drop PDF files here</p>
					<p className="mt-2 text-sm text-[#5d665f]">Select multiple documents to merge.</p>
					<input ref={fileInputRef} type="file" accept=".pdf,application/pdf" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files); event.target.value = "" }} />
					<button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 min-h-11 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]">Browse PDFs</button>
				</div>

				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="PDF files to merge">
					<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
						<div><h2 className="text-xl font-semibold text-[#20271f]">Files to merge</h2><p className="mt-1 text-sm text-[#5d665f]">Arrange the documents in the order you want.</p></div>
						<span className="text-sm text-[#5d665f]">{files.length} files</span>
					</div>
					<ol className="space-y-3">
						{files.map(({ id, file }, index) => (
							<li key={id} className="flex min-w-0 items-center gap-3 border border-[#dbe7fb] p-3 sm:gap-4 sm:p-4">
								<div className="flex size-12 shrink-0 items-center justify-center bg-[#eff6ff] text-[#2563eb]"><FiFileText aria-hidden="true" className="text-xl" /></div>
								<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#20271f]">{file.name}</p><p className="mt-1 text-xs text-[#5d665f]">PDF document · Preview</p></div>
								<div className="flex shrink-0 gap-1">
									<button type="button" onClick={() => moveFile(index, -1)} disabled={index === 0} aria-label={`Move ${file.name} up`} className="flex size-9 items-center justify-center border border-[#dbe7fb] text-[#5275b7] disabled:opacity-40"><FiArrowUp aria-hidden="true" /></button>
									<button type="button" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} aria-label={`Move ${file.name} down`} className="flex size-9 items-center justify-center border border-[#dbe7fb] text-[#5275b7] disabled:opacity-40"><FiArrowDown aria-hidden="true" /></button>
									<button type="button" onClick={() => removeFile(id)} aria-label={`Remove ${file.name}`} className="flex size-9 items-center justify-center border border-[#dbe7fb] text-[#5275b7] hover:bg-[#f7faff]"><FiTrash2 aria-hidden="true" /></button>
								</div>
							</li>
						))}
					</ol>
				</section>

				<div className="flex flex-wrap gap-3">
					<button type="button" onClick={mergePdfs} disabled={isMerging || files.length < 2} className="min-h-12 bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60">{isMerging ? "Merging..." : "Merge PDF"}</button>
					<button type="button" onClick={resetTool} disabled={!files.length && !pdfUrl} className="min-h-12 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"><FiRefreshCw aria-hidden="true" className="mr-2 inline" />Reset</button>
				</div>
				{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
				{status && <p role="status" className="text-sm text-[#28734a]">{status}</p>}

				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Merged PDF result">
					<div className="flex min-h-36 flex-col items-center justify-center bg-[#f7faff] px-4 text-center">
						{pdfUrl ? <iframe title="Merged PDF preview" src={pdfUrl} className="h-96 w-full" /> : <>
						<FiFileText aria-hidden="true" className="text-3xl text-[#9bb7e6]" />
						<h2 className="mt-3 text-base font-semibold text-[#20271f]">Merged PDF will appear here</h2>
						<p className="mt-1 text-sm text-[#5d665f]">The merged document preview and file details will show here.</p>
						</>}
					</div>
					<div className="mt-5 flex flex-col gap-3 sm:flex-row">
						<a href={pdfUrl || undefined} download="digital-toolbox-merged.pdf" aria-disabled={!pdfUrl} className={`inline-flex min-h-12 items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white ${pdfUrl ? "hover:bg-[#1e40af]" : "pointer-events-none opacity-50"}`}><FiDownload aria-hidden="true" />Download PDF</a>
						<button type="button" onClick={resetTool} disabled={!files.length && !pdfUrl} className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"><FiRefreshCw aria-hidden="true" />Merge Another</button>
					</div>
				</section>
			</div>
		</ToolPageLayout>
	)
}

export default MergePdf
