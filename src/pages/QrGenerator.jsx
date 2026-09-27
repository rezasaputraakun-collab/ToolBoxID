import { useState } from "react"
import { FiDownload, FiGrid, FiHash } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

function QrGenerator() {
	const [text, setText] = useState("")
	const [qrDataUrl, setQrDataUrl] = useState("")
	const [isGenerating, setIsGenerating] = useState(false)
	const [error, setError] = useState("")

	async function generateQr() {
		if (!text.trim()) {
			setError("Enter text or a URL to generate a QR code.")
			setQrDataUrl("")
			return
		}
		setIsGenerating(true)
		setError("")
		try {
			const QRCode = (await import("qrcode")).default
			const dataUrl = await QRCode.toDataURL(text.trim(), { width: 512, margin: 2, errorCorrectionLevel: "H" })
			setQrDataUrl(dataUrl)
		} catch {
			setQrDataUrl("")
			setError("Could not generate a QR code. Try shorter text or a valid URL.")
		} finally {
			setIsGenerating(false)
		}
	}

	function clearQr() {
		setText("")
		setQrDataUrl("")
		setError("")
	}

	return (
		<ToolPageLayout title="QR Code Generator" description="Create a QR code preview for text or a web address." Icon={FiHash}>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
				<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="QR code input">
					<label htmlFor="qr-content" className="mb-3 block text-sm font-medium text-[#20271f]">Text or URL</label>
					<textarea id="qr-content" rows={8} value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") generateQr() }} placeholder="Enter text or paste a URL..." className="w-full resize-y border border-[#dbe7fb] px-4 py-3 text-base leading-6 text-[#20271f] outline-none placeholder:text-[#788071] focus:border-[#60a5fa]" />
					<div className="mt-5 flex flex-wrap gap-3">
						<button type="button" onClick={generateQr} disabled={isGenerating} className="inline-flex min-h-12 w-full items-center justify-center bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:cursor-wait disabled:opacity-60 sm:w-auto">{isGenerating ? "Generating..." : "Generate QR Code"}</button>
						<button type="button" onClick={clearQr} className="min-h-12 border border-[#dbe7fb] px-5 text-sm font-medium text-[#20271f] hover:bg-[#f7faff]">Clear</button>
					</div>
					{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
				</section>
				<section className="flex flex-col items-center justify-center border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="QR code preview">
					<div className="flex aspect-square w-full max-w-64 items-center justify-center border border-dashed border-[#b9cbea] bg-[#f7faff] p-6">
						{qrDataUrl ? <img src={qrDataUrl} alt="Generated QR code" className="h-full w-full object-contain" /> : <div className="text-center"><FiGrid aria-hidden="true" className="mx-auto text-6xl text-[#9bb7e6]" /><p className="mt-4 text-sm text-[#5d665f]">QR code preview will appear here</p></div>}
					</div>
					<a href={qrDataUrl || undefined} download="digital-toolbox-qr.png" aria-disabled={!qrDataUrl} className={`mt-5 inline-flex min-h-11 w-full max-w-64 items-center justify-center gap-2 border border-[#dbe7fb] px-5 text-sm font-semibold text-[#20271f] ${qrDataUrl ? "hover:bg-[#f7faff]" : "pointer-events-none opacity-50"}`}><FiDownload aria-hidden="true" />Download QR Code</a>
				</section>
			</div>
		</ToolPageLayout>
	)
}

export default QrGenerator
