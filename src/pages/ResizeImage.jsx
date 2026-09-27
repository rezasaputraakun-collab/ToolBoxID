import { useEffect, useRef, useState } from "react"
import {
	FiAlertCircle,
	FiDownload,
	FiImage,
	FiLock,
	FiRefreshCw,
	FiUploadCloud,
} from "react-icons/fi"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

function ResizeImage() {
	const fileInputRef = useRef(null)
	const objectUrls = useRef(new Set())
	const [image, setImage] = useState(null)
	const [result, setResult] = useState(null)
	const [dimensions, setDimensions] = useState({ width: "", height: "" })
	const [unit, setUnit] = useState("px")
	const [lockRatio, setLockRatio] = useState(true)
	const [isDragging, setIsDragging] = useState(false)
	const [isResizing, setIsResizing] = useState(false)
	const [error, setError] = useState("")
	const [status, setStatus] = useState("")

	useEffect(() => () => objectUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])

	function createTrackedUrl(blob) {
		const url = URL.createObjectURL(blob)
		objectUrls.current.add(url)
		return url
	}

	function releaseUrl(url) {
		if (!url) return
		URL.revokeObjectURL(url)
		objectUrls.current.delete(url)
	}

	async function selectImage(file) {
		if (!file) return
		if (!file.type.startsWith("image/")) {
			setError("Choose a valid image file.")
			return
		}
		setError("")
		setStatus("")
		setIsResizing(true)
		let bitmap
		try {
			bitmap = await createImageBitmap(file)
			const width = bitmap.width
			const height = bitmap.height
			const previewUrl = createTrackedUrl(file)
			releaseUrl(image?.previewUrl)
			releaseUrl(result?.previewUrl)
			setImage({ file, previewUrl, width, height })
			setResult(null)
			setDimensions({ width: String(width), height: String(height) })
			setUnit("px")
		} catch {
			setError("This image could not be opened by your browser.")
		} finally {
			bitmap?.close()
			setIsResizing(false)
		}
	}

	function updateWidth(value) {
		setDimensions((current) => ({
			width: value,
			height: lockRatio && value !== "" && image
				? unit === "%" ? value : String(Math.max(1, Math.round(Number(value) * image.height / image.width)))
				: current.height,
		}))
	}

	function updateHeight(value) {
		setDimensions((current) => ({
			height: value,
			width: lockRatio && value !== "" && image
				? unit === "%" ? value : String(Math.max(1, Math.round(Number(value) * image.width / image.height)))
				: current.width,
		}))
	}

	function changeUnit(nextUnit) {
		if (image && nextUnit !== unit) {
			setDimensions((current) => {
				const convert = (value, originalSize) => {
					if (value === "" || !Number.isFinite(Number(value))) return ""
					return nextUnit === "%"
						? String(Number(value) / originalSize * 100)
						: String(Math.round(Number(value) / 100 * originalSize))
				}
				return {
					width: convert(current.width, image.width),
					height: convert(current.height, image.height),
				}
			})
		}
		setUnit(nextUnit)
	}

	async function resizeImage() {
		if (!image) {
			setError("Choose an image before resizing.")
			return
		}
		const widthValue = Number(dimensions.width)
		const heightValue = Number(dimensions.height)
		if (!Number.isFinite(widthValue) || !Number.isFinite(heightValue) || widthValue <= 0 || heightValue <= 0) {
			setError("Width and height must be valid numbers greater than zero.")
			return
		}
		const outputWidth = Math.round(unit === "%" ? image.width * widthValue / 100 : widthValue)
		const outputHeight = Math.round(unit === "%" ? image.height * heightValue / 100 : heightValue)
		if (outputWidth > 20000 || outputHeight > 20000 || outputWidth * outputHeight > 100_000_000) {
			setError("The requested dimensions are too large for browser memory. Choose a smaller size.")
			return
		}

		setIsResizing(true)
		setError("")
		setStatus("")
		try {
			const bitmap = await createImageBitmap(image.file)
			const canvas = document.createElement("canvas")
			canvas.width = outputWidth
			canvas.height = outputHeight
			const context = canvas.getContext("2d")
			if (!context) throw new Error("Could not prepare the image canvas.")
			context.drawImage(bitmap, 0, 0, outputWidth, outputHeight)
			bitmap.close()
			const outputType = ["image/png", "image/jpeg", "image/webp"].includes(image.file.type) ? image.file.type : "image/png"
			const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Image export failed.")), outputType, 0.92))
			const previewUrl = createTrackedUrl(blob)
			releaseUrl(result?.previewUrl)
			const extension = blob.type.split("/")[1] || "png"
			setResult({ blob, previewUrl, width: outputWidth, height: outputHeight, name: `${image.file.name.replace(/\.[^.]+$/u, "")}-resized.${extension}` })
			setStatus(`Image resized to ${outputWidth} × ${outputHeight} px.`)
		} catch (resizeError) {
			setError(resizeError.message || "The image could not be resized in this browser.")
		} finally {
			setIsResizing(false)
		}
	}

	function resetImage() {
		releaseUrl(image?.previewUrl)
		releaseUrl(result?.previewUrl)
		setImage(null)
		setResult(null)
		setDimensions({ width: "", height: "" })
		setUnit("px")
		setError("")
		setStatus("")
	}

	return (
		<div className="min-h-screen bg-white text-[#20271f]">
			<header className="mx-auto max-w-7xl px-6 md:px-10">
				<Navbar />
			</header>

			<main id="home">
				<section className="bg-white px-6 py-12 md:px-10 md:py-16">
					<div className="mx-auto max-w-6xl">
						<div className="mb-8 text-center">
							<div className="mx-auto mb-4 flex size-12 items-center justify-center bg-[#eff6ff] text-[#2563eb]">
								<FiImage aria-hidden="true" className="text-2xl" />
							</div>
							<h1 className="bg-linear-to-r from-white via-[#60a5fa] to-[#1d4ed8] bg-clip-text font-serif text-5xl leading-tight text-transparent drop-shadow-[0_2px_5px_rgba(37,99,235,0.55)] sm:text-6xl md:text-7xl">
								Resize Image
							</h1>
							<p className="mt-4 text-base text-[#394334] md:text-lg">
								Resize your images to the dimensions you need.
							</p>
						</div>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
							<div className="space-y-5">
								<div onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectImage(event.dataTransfer.files?.[0]) }} className={`border border-dashed p-7 text-center transition-colors sm:p-10 ${isDragging ? "border-[#2563eb] bg-[#eff6ff]" : "border-[#b9cbea] bg-[#f7faff]"}`}>
									<FiUploadCloud aria-hidden="true" className="mx-auto text-4xl text-[#2563eb]" />
									<p className="mt-4 text-base font-medium text-[#20271f]">
										Drag &amp; drop an image here
									</p>
									<p className="mt-2 text-sm text-[#5d665f]">or browse from your device</p>
									<input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => { selectImage(event.target.files?.[0]); event.target.value = "" }} />
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="mt-5 inline-flex min-h-11 items-center justify-center bg-[#1d4ed8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60a5fa]"
									>
											Browse Image
									</button>
								</div>

								<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Image preview">
									<div className="flex min-h-56 flex-col items-center justify-center bg-[#f7faff] px-4 text-center sm:min-h-64">
										{image ? <img src={image.previewUrl} alt={`Preview of ${image.file.name}`} className="max-h-64 max-w-full object-contain" /> : <><FiImage aria-hidden="true" className="text-4xl text-[#9bb7e6]" /><p className="mt-3 text-sm text-[#5d665f]">Image preview will appear here</p></>}
									</div>
									<div className="mt-4 min-w-0">
										<h2 className="truncate text-base font-semibold text-[#20271f]">{image?.file.name || "No image selected"}</h2>
										<p className="mt-1 text-sm text-[#5d665f]">
											{image ? `${image.file.type.split("/")[1]?.toUpperCase() || "IMAGE"} · ${(image.file.size / 1024).toFixed(1)} KB · ${image.width} × ${image.height} px` : "Format: JPG, PNG, WebP · Size: --"}
										</p>
									</div>
								</section>
							</div>

							<section className="border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Resize settings">
								<h2 className="text-xl font-semibold text-[#20271f]">Dimensions</h2>
								<p className="mt-2 text-sm leading-6 text-[#5d665f]">
									Set the output size for your image.
								</p>

								<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
									<div>
										<label htmlFor="resize-width" className="mb-2 block text-sm font-medium text-[#20271f]">
											Width
										</label>
										<input
											id="resize-width"
											type="number"
											min="1"
											inputMode="numeric"
											value={dimensions.width}
											onChange={(event) => updateWidth(event.target.value)}
											placeholder="1200"
											className="min-h-12 w-full min-w-0 border border-[#dbe7fb] px-4 text-base text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]"
										/>
									</div>
									<span className="hidden pb-3 text-sm text-[#788071] sm:block" aria-hidden="true">x</span>
									<div>
										<label htmlFor="resize-height" className="mb-2 block text-sm font-medium text-[#20271f]">
											Height
										</label>
										<input
											id="resize-height"
											type="number"
											min="1"
											inputMode="numeric"
											value={dimensions.height}
											onChange={(event) => updateHeight(event.target.value)}
											placeholder="800"
											className="min-h-12 w-full min-w-0 border border-[#dbe7fb] px-4 text-base text-[#20271f] outline-none transition-colors placeholder:text-[#788071] focus:border-[#60a5fa]"
										/>
									</div>
								</div>

								<label className="mt-5 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#394334]">
										<input type="checkbox" checked={lockRatio} onChange={(event) => setLockRatio(event.target.checked)} className="size-4 accent-[#2563eb]" />
									<FiLock aria-hidden="true" className="text-[#5275b7]" />
									Lock Aspect Ratio
								</label>

								<div className="mt-5">
									<label htmlFor="resize-unit" className="mb-2 block text-sm font-medium text-[#20271f]">
										Unit
									</label>
									<select
										id="resize-unit"
										value={unit}
										onChange={(event) => changeUnit(event.target.value)}
										className="min-h-12 w-full border border-[#dbe7fb] bg-white px-4 text-base text-[#20271f] outline-none focus:border-[#60a5fa]"
									>
										<option value="px">Pixels (px)</option>
											<option value="%">Percent (%)</option>
									</select>
								</div>

								<button
									type="button"
									onClick={resizeImage}
									disabled={isResizing || !image}
									className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isResizing ? "Resizing..." : "Resize Image"}
								</button>
								{error && <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-700"><FiAlertCircle aria-hidden="true" />{error}</p>}
								{status && <p role="status" className="mt-3 text-sm text-[#28734a]">{status}</p>}
							</section>
						</div>

						<section className="mt-8 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Resize result">
							<div className="flex min-h-36 flex-col items-center justify-center bg-[#f7faff] px-4 text-center">
										{result ? <img src={result.previewUrl} alt="Resized image result" className="max-h-96 max-w-full object-contain" /> : <><FiImage aria-hidden="true" className="text-3xl text-[#9bb7e6]" /><h2 className="mt-3 text-base font-semibold text-[#20271f]">Resized image will appear here</h2><p className="mt-1 text-sm text-[#5d665f]">Your output preview and dimensions will be shown after resizing.</p></>}
							</div>
							{result && <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"><div className="border border-[#dbe7fb] p-4"><dt className="text-sm text-[#5d665f]">Original Size</dt><dd className="mt-1 font-semibold text-[#20271f]">{(image.file.size / 1024).toFixed(1)} KB · {image.width} × {image.height} px</dd></div><div className="border border-[#dbe7fb] p-4"><dt className="text-sm text-[#5d665f]">Resized Size</dt><dd className="mt-1 font-semibold text-[#20271f]">{(result.blob.size / 1024).toFixed(1)} KB · {result.width} × {result.height} px</dd></div></dl>}
							<div className="mt-5 flex flex-col gap-3 sm:flex-row">
								<button
									type="button"
									disabled
									className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white opacity-60 disabled:cursor-not-allowed"
								>
									Download Image
								</button>
									<a href={result?.previewUrl} download={result?.name} aria-disabled={!result} className={`inline-flex min-h-12 items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white ${result ? "hover:bg-[#1e40af]" : "pointer-events-none opacity-50"}`}>
										<FiDownload aria-hidden="true" />Download Image
									</a>
									<button
									type="button"
										onClick={resetImage}
										disabled={!image}
										className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff] disabled:cursor-not-allowed disabled:opacity-50"
								>
									<FiRefreshCw aria-hidden="true" />
									Resize Another Image
								</button>
							</div>
						</section>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default ResizeImage
