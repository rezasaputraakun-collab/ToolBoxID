import { useRef, useState } from "react"
import JsBarcode from "jsbarcode"
import { FiDownload, FiHash, FiRefreshCw } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

const barcodeFormats = ["CODE128", "CODE39", "EAN13", "UPC"]

function BarcodeGenerator() {
	const canvasRef = useRef(null)
	const [value, setValue] = useState("")
	const [format, setFormat] = useState("CODE128")
	const [isGenerated, setIsGenerated] = useState(false)
	const [pngDataUrl, setPngDataUrl] = useState("")
	const [error, setError] = useState("")

	function generate(event) {
		event.preventDefault()
		const normalizedValue = value.trim()
		if (!normalizedValue) {
			setError("Enter a value to generate a barcode.")
			setIsGenerated(false)
			return
		}
		try {
			JsBarcode(canvasRef.current, normalizedValue, {
				format,
				lineColor: "#20271f",
				background: "#ffffff",
				width: 2,
				height: 110,
				margin: 16,
				displayValue: true,
			})
			setPngDataUrl(canvasRef.current.toDataURL("image/png"))
			setError("")
			setIsGenerated(true)
		} catch (generationError) {
			setPngDataUrl("")
			setIsGenerated(false)
			setError(generationError.message || `That value is not valid for ${format}.`)
		}
	}

	function reset() {
		setValue("")
		setFormat("CODE128")
		setError("")
		setIsGenerated(false)
		setPngDataUrl("")
		const context = canvasRef.current?.getContext("2d")
		context?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
	}

	return (
		<ToolPageLayout title="Barcode Generator" description="Create and download barcodes directly in your browser." Icon={FiHash}>
			<div className="space-y-6">
				<form onSubmit={generate} className="space-y-5 border border-[#dbe7fb] bg-white p-5 sm:p-6">
					<div>
						<label htmlFor="barcode-value" className="mb-2 block text-sm font-medium text-[#20271f]">Text or number</label>
						<input id="barcode-value" value={value} onChange={(event) => { setValue(event.target.value); setIsGenerated(false); setPngDataUrl(""); setError("") }} maxLength={120} className="min-h-12 w-full min-w-0 border border-[#dbe7fb] px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa]" placeholder="Enter a value" autoComplete="off" />
					</div>
					<div>
						<label htmlFor="barcode-format" className="mb-2 block text-sm font-medium text-[#20271f]">Barcode format</label>
						<select id="barcode-format" value={format} onChange={(event) => { setFormat(event.target.value); setIsGenerated(false); setPngDataUrl(""); setError("") }} className="min-h-12 w-full border border-[#dbe7fb] bg-white px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa] sm:max-w-xs">
							{barcodeFormats.map((barcodeFormat) => <option key={barcodeFormat} value={barcodeFormat}>{barcodeFormat}</option>)}
						</select>
					</div>
					<div className="flex flex-wrap gap-3">
						<button type="submit" className="min-h-12 bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af]">Generate Barcode</button>
						<button type="button" onClick={reset} className="inline-flex min-h-12 items-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff]"><FiRefreshCw aria-hidden="true" />Reset</button>
					</div>
				</form>

				{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
				<section className="min-w-0 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Barcode preview">
					<h2 className="text-lg font-semibold text-[#20271f]">Preview</h2>
					<div className="mt-4 flex min-h-44 min-w-0 items-center justify-center overflow-hidden bg-[#f7faff] p-3 sm:p-5">
						{!isGenerated && <p className="text-center text-sm text-[#5d665f]">Your barcode preview will appear here.</p>}
						<canvas ref={canvasRef} role={isGenerated ? "img" : undefined} aria-label={isGenerated ? `${format} barcode for ${value}` : undefined} className={`h-auto max-w-full ${isGenerated ? "block" : "hidden"}`} />
					</div>
						{isGenerated && <a href={pngDataUrl} download={`barcode-${format.toLowerCase()}.png`} className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]"><FiDownload aria-hidden="true" />Download PNG</a>}
				</section>
			</div>
		</ToolPageLayout>
	)
}

export default BarcodeGenerator