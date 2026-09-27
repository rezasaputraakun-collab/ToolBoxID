import { useState } from "react"
import { FiRefreshCw, FiTool } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"

const unitGroups = {
	Length: { Meters: 1, Kilometers: 1000, Centimeters: 0.01, Millimeters: 0.001, Feet: 0.3048, Inches: 0.0254, Miles: 1609.344 },
	Weight: { Kilograms: 1, Grams: 0.001, Milligrams: 0.000001, Pounds: 0.45359237, Ounces: 0.028349523 },
	Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
	Area: { "Square meters": 1, "Square kilometers": 1_000_000, "Square feet": 0.09290304, Acres: 4046.8564224, Hectares: 10_000 },
	Volume: { Liters: 1, Milliliters: 0.001, "Cubic meters": 1000, "US gallons": 3.785411784 },
	Time: { Seconds: 1, Minutes: 60, Hours: 3600, Days: 86400, Weeks: 604800 },
	Data: { Bytes: 1, "Kilobytes (KB)": 1024, "Megabytes (MB)": 1024 ** 2, "Gigabytes (GB)": 1024 ** 3, Bits: 0.125 },
}

const categoryNames = Object.keys(unitGroups)

function convertTemperature(value, from, to) {
	let celsius = value
	if (from === "Fahrenheit") celsius = (value - 32) * 5 / 9
	if (from === "Kelvin") celsius = value - 273.15
	if (to === "Fahrenheit") return celsius * 9 / 5 + 32
	if (to === "Kelvin") return celsius + 273.15
	return celsius
}

function UnitConverter() {
	const [category, setCategory] = useState("Length")
	const [value, setValue] = useState("")
	const initialUnits = Object.keys(unitGroups.Length)
	const [from, setFrom] = useState(initialUnits[0])
	const [to, setTo] = useState(initialUnits[1])
	const [error, setError] = useState("")
	const units = Array.isArray(unitGroups[category]) ? unitGroups[category] : Object.keys(unitGroups[category])
	const numericValue = Number(value)
	let result = "--"
	if (value !== "" && Number.isFinite(numericValue)) {
		const converted = category === "Temperature"
			? convertTemperature(numericValue, from, to)
			: numericValue * unitGroups[category][from] / unitGroups[category][to]
		result = Number(converted.toPrecision(10)).toLocaleString(undefined, { maximumSignificantDigits: 10 })
	}

	function changeCategory(nextCategory) {
		const nextUnits = Array.isArray(unitGroups[nextCategory]) ? unitGroups[nextCategory] : Object.keys(unitGroups[nextCategory])
		setCategory(nextCategory)
		setFrom(nextUnits[0])
		setTo(nextUnits[1])
		setError("")
	}

	function changeValue(nextValue) {
		setValue(nextValue)
		setError(nextValue !== "" && !Number.isFinite(Number(nextValue)) ? "Enter a valid number." : "")
	}

	function swapUnits() {
		setFrom(to)
		setTo(from)
	}

	function clearValues() {
		setValue("")
		setError("")
	}

	return (
		<ToolPageLayout title="Unit Converter" description="Convert common measurements between units." Icon={FiTool}>
			<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Unit conversion settings">
				<div className="max-w-sm">
					<label htmlFor="unit-category" className="mb-2 block text-sm font-medium text-[#20271f]">Category</label>
					<select id="unit-category" value={category} onChange={(event) => changeCategory(event.target.value)} className="min-h-12 w-full border border-[#dbe7fb] bg-white px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa]">
						{categoryNames.map((categoryName) => <option key={categoryName}>{categoryName}</option>)}
					</select>
				</div>

				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1fr)] md:items-end">
					<div>
						<label htmlFor="unit-value" className="mb-2 block text-sm font-medium text-[#20271f]">Value</label>
						<input id="unit-value" type="number" inputMode="decimal" value={value} onChange={(event) => changeValue(event.target.value)} placeholder="Enter a value" className="min-h-12 w-full min-w-0 border border-[#dbe7fb] px-4 text-base text-[#20271f] outline-none placeholder:text-[#788071] focus:border-[#60a5fa]" />
					</div>
					<div>
						<label htmlFor="unit-from" className="mb-2 block text-sm font-medium text-[#20271f]">From</label>
						<select id="unit-from" value={from} onChange={(event) => setFrom(event.target.value)} className="min-h-12 w-full border border-[#dbe7fb] bg-white px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa]">{units.map((unit) => <option key={unit}>{unit}</option>)}</select>
					</div>
					<button type="button" onClick={swapUnits} aria-label="Swap units" className="flex size-12 items-center justify-center border border-[#dbe7fb] text-[#5275b7] hover:bg-[#f7faff]"><FiRefreshCw aria-hidden="true" /></button>
					<div>
						<label htmlFor="unit-to" className="mb-2 block text-sm font-medium text-[#20271f]">To</label>
						<select id="unit-to" value={to} onChange={(event) => setTo(event.target.value)} className="min-h-12 w-full border border-[#dbe7fb] bg-white px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa]">{units.map((unit) => <option key={unit}>{unit}</option>)}</select>
					</div>
				</div>

				<div className="mt-6 border border-[#dbe7fb] bg-[#f7faff] p-5" aria-live="polite">
					<p className="text-sm text-[#5d665f]">Converted result</p>
					<p className="mt-2 text-2xl font-semibold text-[#20271f]" aria-live="polite">{error ? "--" : result}</p>
				</div>
				{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
				<div className="mt-5 flex flex-wrap gap-3">
					<button type="button" onClick={swapUnits} className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#dbe7fb] px-5 text-sm font-medium text-[#20271f] hover:bg-[#f7faff]"><FiRefreshCw aria-hidden="true" />Swap</button>
					<button type="button" onClick={clearValues} className="min-h-11 border border-[#dbe7fb] px-5 text-sm font-medium text-[#20271f] hover:bg-[#f7faff]">Clear</button>
				</div>
			</section>
		</ToolPageLayout>
	)
}

export default UnitConverter
