import { useEffect, useRef, useState } from "react"
import {
	FiAlertCircle,
	FiDownload,
	FiImage,
	FiRefreshCw,
	FiUploadCloud,
} from "react-icons/fi"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const qualityOptions = [
	{ label: "Low", value: 0.55 },
	{ label: "Medium", value: 0.75 },
	{ label: "High", value: 0.9 },
]

function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getFileFormat(file) {
	return file.type.split("/")[1]?.toUpperCase() || file.name.split(".").pop().toUpperCase()
}

function CompressImage() {
	const fileInputRef = useRef(null)
	const [image, setImage] = useState(null)
	const [compressedImage, setCompressedImage] = useState(null)
	const [quality, setQuality] = useState(0.75)
	const [isDragging, setIsDragging] = useState(false)
	const [isCompressing, setIsCompressing] = useState(false)
	const [error, setError] = useState("")

	useEffect(() => {
		if (!image?.previewUrl) return undefined
		return () => URL.revokeObjectURL(image.previewUrl)
	}, [image?.previewUrl])

	useEffect(() => {
		if (!compressedImage?.previewUrl) return undefined
		return () => URL.revokeObjectURL(compressedImage.previewUrl)
	}, [compressedImage?.previewUrl])

	function selectImage(file) {
		if (!file) return
		if (!file.type.startsWith("image/")) {
			setError("Choose an image file to continue.")
			return
		}

		setError("")
		setCompressedImage(null)
		setImage({ file, previewUrl: URL.createObjectURL(file) })
	}

	function handleFileChange(event) {
		selectImage(event.target.files?.[0])
		event.target.value = ""
	}

	function handleDrop(event) {
		event.preventDefault()
		setIsDragging(false)
		selectImage(event.dataTransfer.files?.[0])
	}

	async function handleCompress() {
		if (!image) return

		setIsCompressing(true)
		setError("")
		setCompressedImage(null)

		let bitmap
		try {
			bitmap = await createImageBitmap(image.file)
			const canvas = document.createElement("canvas")
			canvas.width = bitmap.width
			canvas.height = bitmap.height

			const context = canvas.getContext("2d")
			if (!context) throw new Error("Your browser could not prepare this image.")

			context.drawImage(bitmap, 0, 0)
			const blob = await new Promise((resolve, reject) => {
				canvas.toBlob(
					(result) => {
						if (result) resolve(result)
						else reject(new Error("Image compression failed. Please try another image."))
					},
					"image/webp",
					quality,
				)
			})

			const extension = blob.type.split("/")[1] || "webp"
			const baseName = image.file.name.replace(/\.[^.]+$/, "")
			setCompressedImage({
				blob,
				previewUrl: URL.createObjectURL(blob),
				name: `${baseName}-compressed.${extension}`,
			})
		} catch (compressionError) {
			setError(compressionError.message || "Could not compress this image in your browser.")
		} finally {
			bitmap?.close()
			setIsCompressing(false)
		}
	}

	function handleReset() {
		setImage(null)
		setCompressedImage(null)
		setError("")
	}

	const reduction = compressedImage
		? Math.round((1 - compressedImage.blob.size / image.file.size) * 100)
		: 0

	return (
		<div className="min-h-screen bg-white text-[#20271f]">
			<header className="mx-auto max-w-7xl px-6 md:px-10">
				<Navbar />
			</header>

			<main id="home">
				<section className="bg-white px-6 py-12 md:px-10 md:py-16">
					<div className="mx-auto max-w-5xl">
						<div className="mb-8 text-center">
							<div className="mx-auto mb-4 flex size-12 items-center justify-center bg-[#eff6ff] text-[#2563eb]">
								<FiImage aria-hidden="true" className="text-2xl" />
							</div>
							<h1 className="bg-linear-to-r from-white via-[#60a5fa] to-[#1d4ed8] bg-clip-text font-serif text-5xl leading-tight text-transparent drop-shadow-[0_2px_5px_rgba(37,99,235,0.55)] sm:text-6xl md:text-7xl">
								Compress Image
							</h1>
							<p className="mt-4 text-base text-[#394334] md:text-lg">
								Reduce image file size while maintaining good quality.
							</p>
						</div>

						<div
							onDragOver={(event) => {
								event.preventDefault()
								setIsDragging(true)
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
							className={`border border-dashed p-8 text-center transition-colors sm:p-12 ${
								isDragging
									? "border-[#2563eb] bg-[#eff6ff]"
									: "border-[#b9cbea] bg-[#f7faff]"
							}`}
						>
							<FiUploadCloud aria-hidden="true" className="mx-auto text-4xl text-[#2563eb]" />
							<p className="mt-4 text-base font-medium text-[#20271f]">
								Drag &amp; drop an image here
							</p>
							<p className="mt-2 text-sm text-[#5d665f]">or browse from your device</p>
							<input
								ref={fileInputRef}
								id="image-upload"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="sr-only"
							/>
							<label
								htmlFor="image-upload"
								className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center bg-[#1d4ed8] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#60a5fa]"
							>
								Browse Image
							</label>
							<p className="mt-4 text-xs text-[#788071]">Supports image formats your browser can open.</p>
						</div>

						{error && (
							<p role="alert" className="mt-4 flex items-center gap-2 text-sm text-red-700">
								<FiAlertCircle aria-hidden="true" />
								{error}
							</p>
						)}

						{image && (
							<section className="mt-8 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Image settings">
								<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
									<div className="min-w-0">
										<h2 className="truncate text-lg font-semibold text-[#20271f]">{image.file.name}</h2>
										<p className="mt-1 text-sm text-[#5d665f]">
											{getFileFormat(image.file)} <span aria-hidden="true">&middot;</span> Original: {formatFileSize(image.file.size)}
										</p>
									</div>
									<div>
										<p className="mb-2 text-sm font-medium text-[#20271f]">Compression quality</p>
										<div className="inline-flex border border-[#dbe7fb] p-1" role="group" aria-label="Compression quality">
											{qualityOptions.map((option) => (
												<button
													key={option.label}
													type="button"
													aria-pressed={quality === option.value}
													onClick={() => setQuality(option.value)}
													className={`min-h-9 px-3 text-sm transition-colors ${quality === option.value ? "bg-[#eff6ff] font-semibold text-[#1d4ed8]" : "text-[#5d665f] hover:bg-[#f7faff]"}`}
												>
													{option.label}
												</button>
											))}
										</div>
									</div>
								</div>

								<button
									type="button"
									onClick={handleCompress}
									disabled={isCompressing}
									className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
								>
									{isCompressing ? "Compressing..." : "Compress Image"}
								</button>
							</section>
						)}

						{compressedImage && (
							<section className="mt-10" aria-label="Compression results">
								<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
									<figure className="min-w-0 border border-[#dbe7fb] bg-white p-4 sm:p-5">
										<figcaption className="mb-3 text-sm font-semibold text-[#20271f]">Original Image</figcaption>
										<img src={image.previewUrl} alt={`Original ${image.file.name}`} className="h-64 w-full bg-[#f7faff] object-contain" />
									</figure>
									<figure className="min-w-0 border border-[#dbe7fb] bg-white p-4 sm:p-5">
										<figcaption className="mb-3 text-sm font-semibold text-[#20271f]">Compressed Preview</figcaption>
										<img src={compressedImage.previewUrl} alt={`Compressed ${image.file.name}`} className="h-64 w-full bg-[#f7faff] object-contain" />
									</figure>
								</div>

								<dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
									<div className="border border-[#dbe7fb] bg-white p-4">
										<dt className="text-sm text-[#5d665f]">Original Size</dt>
										<dd className="mt-1 text-lg font-semibold text-[#20271f]">{formatFileSize(image.file.size)}</dd>
									</div>
									<div className="border border-[#dbe7fb] bg-white p-4">
										<dt className="text-sm text-[#5d665f]">Compressed Size</dt>
										<dd className="mt-1 text-lg font-semibold text-[#20271f]">{formatFileSize(compressedImage.blob.size)}</dd>
									</div>
									<div className="border border-[#dbe7fb] bg-white p-4">
										<dt className="text-sm text-[#5d665f]">Size Reduction</dt>
										<dd className="mt-1 text-lg font-semibold text-[#20271f]">{reduction}%</dd>
									</div>
								</dl>

								{reduction < 0 && (
									<p className="mt-3 text-sm text-[#5d665f]">
										This format produced a larger file. Try a lower quality setting.
									</p>
								)}

								<div className="mt-6 flex flex-col gap-3 sm:flex-row">
									<a
										href={compressedImage.previewUrl}
										download={compressedImage.name}
										className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#1d4ed8] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af]"
									>
										<FiDownload aria-hidden="true" />
										Download Image
									</a>
									<button
										type="button"
										onClick={handleReset}
										className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] transition-colors hover:bg-[#f7faff]"
									>
										<FiRefreshCw aria-hidden="true" />
										Compress Another Image
									</button>
								</div>
							</section>
						)}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default CompressImage
