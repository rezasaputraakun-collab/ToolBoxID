import { useState } from "react"
import { FiCopy, FiDroplet } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

function hslToHex(hue, saturation, lightness) {
	const s = saturation / 100
	const l = lightness / 100
	const chroma = (1 - Math.abs(2 * l - 1)) * s
	const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1))
	const match = l - chroma / 2
	let rgb
	if (hue < 60) rgb = [chroma, x, 0]
	else if (hue < 120) rgb = [x, chroma, 0]
	else if (hue < 180) rgb = [0, chroma, x]
	else if (hue < 240) rgb = [0, x, chroma]
	else if (hue < 300) rgb = [x, 0, chroma]
	else rgb = [chroma, 0, x]
	return `#${rgb.map((channel) => Math.round((channel + match) * 255).toString(16).padStart(2, "0")).join("")}`.toUpperCase()
}

function makePalette(type) {
	const baseHue = Math.floor(Math.random() * 360)
	const offsets = {
		random: Array.from({ length: 5 }, () => Math.floor(Math.random() * 360)),
		complementary: [0, 180, 12, 168, 192].map((offset) => (baseHue + offset) % 360),
		analogous: [-48, -24, 0, 24, 48].map((offset) => (baseHue + offset + 360) % 360),
		monochromatic: Array(5).fill(baseHue),
	}[type]
	const lightness = type === "monochromatic" ? [32, 42, 52, 62, 72] : [42, 48, 54, 60, 66]
	return offsets.map((hue, index) => ({
		name: `Color ${index + 1}`,
		hex: hslToHex(hue, 68 + (index % 2) * 8, lightness[index]),
	}))
}

function ColorPaletteGenerator() {
	const [paletteType, setPaletteType] = useState("analogous")
	const [palette, setPalette] = useState(() => makePalette("analogous"))
	const [copied, setCopied] = useState("")
	const [error, setError] = useState("")

	function generatePalette() {
		setPalette(makePalette(paletteType))
		setCopied("")
		setError("")
	}

	async function copyHex(hex) {
		try {
			await navigator.clipboard.writeText(hex)
			setCopied(`${hex} copied.`)
			setError("")
		} catch {
			setError("Clipboard access is unavailable in this browser.")
		}
	}

	return (
		<ToolPageLayout title="Color Palette Generator" description="Explore coordinated colors for your next design." Icon={FiDroplet}>
			<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Palette settings">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div className="w-full sm:max-w-xs">
						<label htmlFor="palette-type" className="mb-2 block text-sm font-medium text-[#20271f]">Palette type</label>
						<select id="palette-type" value={paletteType} onChange={(event) => setPaletteType(event.target.value)} className="min-h-12 w-full border border-[#dbe7fb] bg-white px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa]">
							<option value="random">Random</option>
							<option value="complementary">Complementary</option>
							<option value="analogous">Analogous</option>
							<option value="monochromatic">Monochromatic</option>
						</select>
					</div>
					<button type="button" onClick={generatePalette} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af]">Generate New Palette</button>
				</div>
			</section>

			<section className="mt-6 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Generated color palette">
				<div className="mb-5 flex items-center gap-2"><FiDroplet aria-hidden="true" className="text-[#2563eb]" /><h2 className="text-lg font-semibold text-[#20271f]">Palette preview</h2></div>
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
					{palette.map(({ name, hex }) => (
						<div key={hex} className="min-w-0 border border-[#dbe7fb] bg-white p-2">
							<div className="h-28 w-full sm:h-36" style={{ backgroundColor: hex }} role="img" aria-label={`${name} color swatch ${hex}`} />
							<p className="mt-3 truncate text-xs font-medium text-[#5d665f]">{name}</p>
							<div className="mt-1 flex min-w-0 items-center justify-between gap-1">
								<code className="truncate text-sm font-semibold text-[#20271f]">{hex}</code>
								<button type="button" onClick={() => copyHex(hex)} aria-label={`Copy ${hex}`} className="flex size-8 shrink-0 items-center justify-center border border-[#dbe7fb] text-[#5275b7] hover:bg-[#f7faff]"><FiCopy aria-hidden="true" /></button>
							</div>
						</div>
					))}
				</div>
				{copied && <p role="status" className="mt-4 text-sm text-[#28734a]">{copied}</p>}
				{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
			</section>
		</ToolPageLayout>
	)
}

export default ColorPaletteGenerator
