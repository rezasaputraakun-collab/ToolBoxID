import { useState } from "react"
import { FiCopy, FiDroplet } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

function rgbToHsl({ r, g, b }) {
	r /= 255
	g /= 255
	b /= 255
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const delta = max - min
	let h = 0
	let s = 0
	const l = (max + min) / 2
	if (delta) {
		s = delta / (1 - Math.abs(2 * l - 1))
		if (max === r) h = 60 * (((g - b) / delta) % 6)
		else if (max === g) h = 60 * ((b - r) / delta + 2)
		else h = 60 * ((r - g) / delta + 4)
	}
	return { h: (h + 360) % 360, s: s * 100, l: l * 100 }
}

function hslToRgb({ h, s, l }) {
	s /= 100
	l /= 100
	const chroma = (1 - Math.abs(2 * l - 1)) * s
	const x = chroma * (1 - Math.abs((h / 60) % 2 - 1))
	const match = l - chroma / 2
	let channels
	if (h < 60) channels = [chroma, x, 0]
	else if (h < 120) channels = [x, chroma, 0]
	else if (h < 180) channels = [0, chroma, x]
	else if (h < 240) channels = [0, x, chroma]
	else if (h < 300) channels = [x, 0, chroma]
	else channels = [chroma, 0, x]
	return { r: Math.round((channels[0] + match) * 255), g: Math.round((channels[1] + match) * 255), b: Math.round((channels[2] + match) * 255) }
}

function toHex({ r, g, b }) {
	return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function parseColor(format, value) {
	if (format === "HEX") {
		const match = value.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/iu)
		if (!match) throw new Error("Enter a valid 3- or 6-digit HEX color.")
		let hex = match[1]
		if (hex.length === 3) hex = [...hex].map((digit) => digit + digit).join("")
		return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) }
	}

	const parts = value.split(",").map((part) => Number.parseFloat(part.trim().replace(/%/gu, "")))
	if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
		throw new Error(`Enter three valid ${format} values separated by commas.`)
	}
	if (format === "RGB") {
		if (parts.some((part) => part < 0 || part > 255)) throw new Error("RGB values must be between 0 and 255.")
		return { r: Math.round(parts[0]), g: Math.round(parts[1]), b: Math.round(parts[2]) }
	}
	if (parts[0] < 0 || parts[0] > 360 || parts[1] < 0 || parts[1] > 100 || parts[2] < 0 || parts[2] > 100) {
		throw new Error("HSL must use hue 0-360 and saturation/lightness 0-100%.")
	}
	return hslToRgb({ h: parts[0], s: parts[1], l: parts[2] })
}

function ColorConverter() {
	const [color, setColor] = useState({ r: 59, g: 130, b: 246 })
	const [inputs, setInputs] = useState({ HEX: "#3B82F6", RGB: "59, 130, 246", HSL: "217, 91%, 60%" })
	const [error, setError] = useState("")
	const [copied, setCopied] = useState("")
	const hsl = rgbToHsl(color)
	const values = {
		HEX: toHex(color),
		RGB: `${color.r}, ${color.g}, ${color.b}`,
		HSL: `${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`,
	}

	function updateColor(format, value) {
		setInputs((current) => ({ ...current, [format]: value }))
		setCopied("")
		try {
			const nextColor = parseColor(format, value)
			const nextHsl = rgbToHsl(nextColor)
			setColor(nextColor)
			setInputs({
				HEX: toHex(nextColor),
				RGB: `${nextColor.r}, ${nextColor.g}, ${nextColor.b}`,
				HSL: `${Math.round(nextHsl.h)}, ${Math.round(nextHsl.s)}%, ${Math.round(nextHsl.l)}%`,
			})
			setError("")
		} catch (inputError) {
			setError(inputError.message)
		}
	}

	async function copyValue(format) {
		try {
			await navigator.clipboard.writeText(values[format])
			setCopied(`${format} copied.`)
		} catch {
			setError("Clipboard access is unavailable in this browser.")
		}
	}

	function resetColor() {
		setColor({ r: 59, g: 130, b: 246 })
		setInputs({ HEX: "#3B82F6", RGB: "59, 130, 246", HSL: "217, 91%, 60%" })
		setError("")
		setCopied("")
	}

	return (
		<ToolPageLayout title="Color Converter" description="Preview a color and its HEX, RGB, and HSL values." Icon={FiDroplet}>
			<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Color values">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_16rem]">
					<div className="space-y-4">
						{Object.keys(values).map((label) => (
							<div key={label}>
								<label htmlFor={`color-${label.toLowerCase()}`} className="mb-2 block text-sm font-medium text-[#20271f]">{label}</label>
								<div className="flex min-w-0 gap-2">
									<input id={`color-${label.toLowerCase()}`} value={inputs[label]} onChange={(event) => updateColor(label, event.target.value)} aria-label={`${label} color value`} className="min-h-12 min-w-0 flex-1 border border-[#dbe7fb] bg-[#fbfdff] px-4 font-mono text-sm text-[#20271f] outline-none focus:border-[#60a5fa]" />
									<button type="button" onClick={() => copyValue(label)} aria-label={`Copy ${label}`} className="flex size-12 shrink-0 items-center justify-center border border-[#dbe7fb] text-[#5275b7] hover:bg-[#f7faff]"><FiCopy aria-hidden="true" /></button>
								</div>
							</div>
						))}
					</div>
				<div className="flex min-h-56 flex-col border border-[#dbe7fb] p-4">
					<div className="min-h-36 flex-1" style={{ backgroundColor: toHex(color) }} role="img" aria-label={`Color preview: ${toHex(color)}`} />
					<p className="mt-3 flex items-center gap-2 text-sm text-[#5d665f]"><FiDroplet aria-hidden="true" />Color preview</p>
				</div>
			</div>
		</section>

			{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
			{copied && <p role="status" className="mt-4 text-sm text-[#28734a]">{copied}</p>}
			<section className="mt-6 border border-[#dbe7fb] bg-[#f7faff] p-5 sm:p-6" aria-label="Converted color results">
				<h2 className="text-lg font-semibold text-[#20271f]">Color formats</h2>
				<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5d665f]">{Object.entries(values).map(([format, value]) => <p key={format}><span className="font-medium text-[#20271f]">{format}:</span> {value}</p>)}</div>
				<button type="button" onClick={resetColor} className="mt-4 min-h-10 border border-[#dbe7fb] bg-white px-4 text-sm font-medium text-[#20271f] hover:bg-[#f7faff]">Reset</button>
			</section>
		</ToolPageLayout>
	)
}

export default ColorConverter
