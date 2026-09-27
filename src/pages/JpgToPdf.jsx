import { useEffect, useRef, useState } from "react"
import { FiArrowDown, FiArrowUp, FiDownload, FiFileText, FiRefreshCw, FiTrash2, FiUploadCloud } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

function JpgToPdf() {
	const [images, setImages] = useState([])
	const [pdfUrl, setPdfUrl] = useState("")
	const [isConverting, setIsConverting] = useState(false)
	const [error, setError] = useState("")
	const [status, setStatus] = useState("")
	const fileInputRef = useRef(null)
	const previewUrls = useRef(new Set())
	const pdfUrls = useRef(new Set())

	useEffect(() => () => {
		previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
		pdfUrls.current.forEach((url) => URL.revokeObjectURL(url))
	}, [])

	function clearPdfResults() {
		pdfUrls.current.forEach((url) => URL.revokeObjectURL(url))
		pdfUrls.current.clear()
		setPdfUrl("")
	}

	function addFiles(fileList) {
		const files = Array.from(fileList)
		const invalid = files.find((file) => !["image/jpeg", "image/jpg"].includes(file.type) && !/\.jpe?g$/iu.test(file.name))
		if (invalid) {
			setError(`${invalid.name} is not a JPG/JPEG image.`)
			return
		}
		setError("")
		setStatus("")
		clearPdfResults()
		const nextImages = files.map((file) => {
			const previewUrl = URL.createObjectURL(file)
			previewUrls.current.add(previewUrl)
			return { id: crypto.randomUUID(), file, previewUrl }
		})
		setImages((current) => [...current, ...nextImages])
	}

	function removeImage(id) {
		setImages((current) => {
			const removed = current.find((image) => image.id === id)
			if (removed) {
				URL.revokeObjectURL(removed.previewUrl)
				previewUrls.current.delete(removed.previewUrl)
			}
			return current.filter((image) => image.id !== id)
		})
	}

	function moveImage(index, direction) {
		setImages((current) => {
			const target = index + direction
			if (target < 0 || target >= current.length) return current
			const next = [...current]
			;[next[index], next[target]] = [next[target], next[index]]
			return next
		})
	}

	async function convertToPdf() {
		if (!images.length) {
			setError("Add at least one JPG image first.")
			return
		}
		setIsConverting(true)
		setError("")
		setStatus("")
		try {
			const { PDFDocument } = await import("pdf-lib")
			const pdf = await PDFDocument.create()
			for (const { file } of images) {
				const image = await pdf.embedJpg(await file.arrayBuffer())
				const page = pdf.addPage([image.width, image.height])
				page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
			}
			const blob = new Blob([await pdf.save()], { type: "application/pdf" })
			const url = URL.createObjectURL(blob)
			pdfUrls.current.add(url)
			setPdfUrl(url)
			setStatus(`PDF created with ${images.length} page${images.length === 1 ? "" : "s"}.`)
		} catch {
			setError("Could not create the PDF. Check that every file is a valid JPG/JPEG image.")
		} finally {
			setIsConverting(false)
		}
	}

	function resetTool() {
		images.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl))
		previewUrls.current.clear()
		clearPdfResults()
		setImages([])
		setPdfUrl("")
		setError("")
		setStatus("")
	}

	return (
		<ToolPageLayout title="JPG to PDF" description="Combine JPG images into one easy-to-share PDF document." Icon={FiFileText}>
			<div className="space-y-6">
				<div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }} className="border border-dashed border-[#b9cbea] bg-[#f7faff] p-8 text-center sm:p-10">
					<FiUploadCloud aria-hidden="true" className="mx-auto text-4xl text-[#2563eb]" />
					<p className="mt-4 text-base font-medium text-[#20271f]">Drag &amp; drop JPG images here</p>
					<p className="mt-2 text-sm text-[#5d665f]">Add one or more images to create a PDF.</p>
					<input ref={fileInputRef} type="file" accept=".jpg,.jpeg,image/jpeg" multiple className="sr-only" onChange={(event) => { addFiles(event.target.files); event.target.value = "" }} />
					<button type="button" onClick={() => fileInputRef.current?.click()} className="mt-5 min-h-11 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]">Browse Images</button>
				</div>

				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Selected images">
					<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
						<div>
							<h2 className="text-xl font-semibold text-[#20271f]">Images</h2>
							<p className="mt-1 text-sm text-[#5d665f]">Arrange images in the order they should appear in the PDF.</p>
						</div>
						<span className="text-sm text-[#5d665f]">{images.length} image{images.length === 1 ? "" : "s"}</span>
					</div>
					<ol className="space-y-3">
						{images.map(({ id, file, previewUrl }, index) => (
							<li key={id} className="flex min-w-0 items-center gap-3 border border-[#dbe7fb] p-3 sm:gap-4 sm:p-4">
								<img src={previewUrl} alt={`Preview ${file.name}`} className="size-14 shrink-0 object-cover" />
								<div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#20271f]">{file.name}</p><p className="mt-1 text-xs text-[#5d665f]">JPG image · {(file.size / 1024).toFixed(1)} KB</p></div>
								<div className="flex shrink-0 gap-1">
									<button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0} aria-label={`Move ${file.name} up`} className="flex size-9 items-center justify-center border border-[#dbe7fb] text-[#5275b7] disabled:opacity-40"><FiArrowUp aria-hidden="true" /></button>
									<button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1} aria-label={`Move ${file.name} down`} className="flex size-9 items-center justify-center border border-[#dbe7fb] text-[#5275b7] disabled:opacity-40"><FiArrowDown aria-hidden="true" /></button>
									<button type="button" onClick={() => removeImage(id)} aria-label={`Remove ${file.name}`} className="flex size-9 items-center justify-center border border-[#dbe7fb] text-[#5275b7] hover:bg-[#f7faff]"><FiTrash2 aria-hidden="true" /></button>
								</div>
							</li>
						))}
					</ol>
				</section>

				<div className="flex flex-wrap gap-3">
					<button type="button" onClick={convertToPdf} disabled={isConverting || !images.length} className="min-h-12 bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60">{isConverting ? "Converting..." : "Convert to PDF"}</button>
					<button type="button" onClick={resetTool} disabled={!images.length && !pdfUrl} className="min-h-12 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"><FiRefreshCw aria-hidden="true" className="mr-2 inline" />Reset</button>
				</div>
				{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
				{status && <p role="status" className="text-sm text-[#28734a]">{status}</p>}

				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="PDF result">
					<div className="flex min-h-36 flex-col items-center justify-center bg-[#f7faff] px-4 text-center">
						{pdfUrl ? <iframe title="PDF preview" src={pdfUrl} className="h-96 w-full" /> : <>
						<FiFileText aria-hidden="true" className="text-3xl text-[#9bb7e6]" />
						<h2 className="mt-3 text-base font-semibold text-[#20271f]">Your PDF will appear here</h2>
						<p className="mt-1 text-sm text-[#5d665f]">The combined document preview and file details will show here.</p>
						</>}
					</div>
					<div className="mt-5 flex flex-col gap-3 sm:flex-row">
						<a href={pdfUrl || undefined} download="digital-toolbox-images.pdf" aria-disabled={!pdfUrl} className={`inline-flex min-h-12 items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white ${pdfUrl ? "hover:bg-[#1e40af]" : "pointer-events-none opacity-50"}`}><FiDownload aria-hidden="true" />Download PDF</a>
						<button type="button" onClick={resetTool} disabled={!images.length && !pdfUrl} className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"><FiRefreshCw aria-hidden="true" />Convert Another</button>
					</div>
				</section>
			</div>
		</ToolPageLayout>
	)
}

export default JpgToPdf
