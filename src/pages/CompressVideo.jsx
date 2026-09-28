import { useEffect, useState } from "react"
import { FiDownload, FiRefreshCw, FiUploadCloud, FiVideo } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"
import { MAX_VIDEO_FILE_SIZE, runVideoTranscode } from "../lib/videoFfmpeg"

const qualityOptions = {
	low: { label: "Low", description: "More aggressive · up to 960px wide", crf: "36", bitrateRatio: 0.4, maxWidth: 960, audioRatio: 0.55 },
	medium: { label: "Medium", description: "Balanced · original resolution", crf: "30", bitrateRatio: 0.55, audioRatio: 0.7 },
	high: { label: "High", description: "Quality priority · original resolution", crf: "24", bitrateRatio: 0.75, audioRatio: 0.85 },
}

const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`
const formatResolution = ({ width, height }) => width && height ? `${width}×${height}` : "Unknown"

function compressionArgs(metadata, selectedQuality) {
	const args = ["-map", "0:v:0", "-map", "0:a?"]
	args.push("-c:v", "libx264", "-preset", "veryfast")
	if (metadata.videoBitrate) {
		const targetVideoBitrate = Math.floor(metadata.videoBitrate * selectedQuality.bitrateRatio)
		args.push("-b:v", String(targetVideoBitrate), "-maxrate", String(targetVideoBitrate), "-bufsize", String(targetVideoBitrate * 2))
	} else {
		args.push("-crf", selectedQuality.crf)
	}
	if (selectedQuality.maxWidth) {
		args.push("-vf", `scale=w='min(${selectedQuality.maxWidth},iw)':h=-2`)
	}
	const targetAudioBitrate = metadata.audioBitrate
		? Math.floor(metadata.audioBitrate * selectedQuality.audioRatio)
		: selectedQuality === qualityOptions.high ? 96000 : selectedQuality === qualityOptions.medium ? 80000 : 64000
	args.push("-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", String(targetAudioBitrate), "-movflags", "+faststart")
	return args
}

function CompressVideo() {
	const [file, setFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState("")
	const [compressedUrl, setCompressedUrl] = useState("")
	const [compressedSize, setCompressedSize] = useState(0)
	const [originalResolution, setOriginalResolution] = useState(null)
	const [outputResolution, setOutputResolution] = useState(null)
	const [quality, setQuality] = useState("medium")
	const [isProcessing, setIsProcessing] = useState(false)
	const [progress, setProgress] = useState(0)
	const [status, setStatus] = useState("")
	const [error, setError] = useState("")

	useEffect(() => () => {
		if (previewUrl) URL.revokeObjectURL(previewUrl)
	}, [previewUrl])

	useEffect(() => () => {
		if (compressedUrl) URL.revokeObjectURL(compressedUrl)
	}, [compressedUrl])

	function chooseFile(nextFile) {
		setError("")
		setStatus("")
		setCompressedUrl("")
		setCompressedSize(0)
		setOriginalResolution(null)
		setOutputResolution(null)
		setProgress(0)
		if (!nextFile) return
		if (!/\.(mp4|webm|mov)$/i.test(nextFile.name)) {
			setFile(null)
			setPreviewUrl("")
			setError("Choose an MP4, WebM, or MOV video file.")
			return
		}
		if (nextFile.size > MAX_VIDEO_FILE_SIZE) {
			setFile(null)
			setPreviewUrl("")
			setError("This video exceeds the 100 MB browser-processing limit. Choose a smaller file.")
			return
		}
		setFile(nextFile)
		setPreviewUrl(URL.createObjectURL(nextFile))
	}

	async function compress() {
		if (!file) return
		setIsProcessing(true)
		setError("")
		setStatus("Preparing compression...")
		setProgress(0)
		const selectedQuality = qualityOptions[quality]
		setCompressedUrl("")
		setCompressedSize(0)
		setOriginalResolution(null)
		setOutputResolution(null)
		try {
			const { bytes, sourceMetadata, outputMetadata } = await runVideoTranscode(
				file,
				"compressed.mp4",
				(metadata) => compressionArgs(metadata, selectedQuality),
				setProgress,
				setStatus,
			)
			if (bytes.byteLength >= file.size) {
				throw new Error(`Compressed file is not smaller than the original (${formatBytes(file.size)} → ${formatBytes(bytes.byteLength)}). Try Medium or Low quality.`)
			}
			setCompressedSize(bytes.byteLength)
			setOriginalResolution(sourceMetadata)
			setOutputResolution(outputMetadata)
			setCompressedUrl(URL.createObjectURL(new Blob([bytes], { type: "video/mp4" })))
			setStatus("Compression complete. The result is smaller than the original.")
		} catch (compressionError) {
			setError(compressionError.message || "Could not compress this video. Its codec may not be supported by the browser engine.")
			setStatus("")
		} finally {
			setIsProcessing(false)
		}
	}

	function reset() {
		setFile(null)
		setPreviewUrl("")
		setCompressedUrl("")
		setCompressedSize(0)
		setOriginalResolution(null)
		setOutputResolution(null)
		setQuality("medium")
		setError("")
		setStatus("")
		setProgress(0)
	}

	const sizeReduced = file && compressedSize < file.size
		? ((file.size - compressedSize) / file.size) * 100
		: 0

	return (
		<ToolPageLayout title="Compress Video" description="Reduce video size locally with FFmpeg running in your browser." Icon={FiVideo}>
			<div className="space-y-6">
				<label className="flex min-h-44 cursor-pointer flex-col items-center justify-center border border-dashed border-[#b9cbea] bg-[#f7faff] p-6 text-center sm:p-10">
					<FiUploadCloud aria-hidden="true" className="text-4xl text-[#2563eb]" />
					<span className="mt-4 text-base font-medium text-[#20271f]">Choose a video file</span>
					<span className="mt-2 text-sm text-[#5d665f]">MP4, WebM, or MOV · up to 100 MB · processed on this device</span>
					<input type="file" accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime" className="sr-only" disabled={isProcessing} onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = "" }} />
				</label>

				{file && (
					<section className="min-w-0 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Selected video">
						<h2 className="truncate text-lg font-semibold text-[#20271f]">{file.name}</h2>
						<p className="mt-1 text-sm text-[#5d665f]">Original size: {formatBytes(file.size)}</p>
						<video controls preload="metadata" src={previewUrl} onError={() => setError("This browser cannot preview the video. Compression may still work if its codec is supported.")} className="mt-4 max-h-96 w-full bg-black" />
					</section>
				)}

				<fieldset className="border border-[#dbe7fb] bg-white p-5 sm:p-6" disabled={isProcessing}>
					<legend className="px-2 text-sm font-semibold text-[#20271f]">Compression quality</legend>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						{Object.entries(qualityOptions).map(([key, option]) => (
							<label key={key} className={`flex cursor-pointer items-start gap-3 border p-4 ${quality === key ? "border-[#60a5fa] bg-[#f7faff]" : "border-[#dbe7fb]"}`}>
								<input type="radio" name="video-quality" value={key} checked={quality === key} onChange={() => setQuality(key)} className="mt-1 accent-[#1d4ed8]" />
								<span><span className="block text-sm font-semibold text-[#20271f]">{option.label}</span><span className="mt-1 block text-xs text-[#5d665f]">{option.description}</span></span>
							</label>
						))}
					</div>
				</fieldset>

				<p className="text-sm leading-6 text-[#5d665f]">Video encoding can use substantial memory and CPU. Files are limited to 100 MB and never leave this browser.</p>
				<div className="flex flex-wrap gap-3">
					<button type="button" onClick={compress} disabled={!file || isProcessing} className="min-h-12 bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Compressing..." : "Compress Video"}</button>
					<button type="button" onClick={reset} disabled={isProcessing} className="inline-flex min-h-12 items-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff]"><FiRefreshCw aria-hidden="true" />Reset</button>
				</div>

				{isProcessing && <div role="status" className="space-y-2"><p className="text-sm text-[#5d665f]">{status} {progress}%</p><progress className="h-2 w-full accent-[#1d4ed8]" max="100" value={progress} aria-label="Video compression progress" /></div>}
				{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
				{compressedUrl && file && (
					<section className="space-y-4 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Compression result">
						<h2 className="text-lg font-semibold text-[#20271f]">Compressed video</h2>
						<video controls preload="metadata" src={compressedUrl} className="max-h-96 w-full bg-black" />
						<dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
							<div><dt className="text-[#5d665f]">Original size</dt><dd className="mt-1 font-semibold text-[#20271f]">{formatBytes(file.size)}</dd></div>
							<div><dt className="text-[#5d665f]">Compressed size</dt><dd className="mt-1 font-semibold text-[#20271f]">{formatBytes(compressedSize)}</dd></div>
							<div><dt className="text-[#5d665f]">Size reduced</dt><dd className="mt-1 font-semibold text-[#20271f]">{sizeReduced ? `${sizeReduced.toFixed(1)}%` : "0%"}</dd></div>
							<div><dt className="text-[#5d665f]">Resolution</dt><dd className="mt-1 font-semibold text-[#20271f]">{formatResolution(originalResolution)} → {formatResolution(outputResolution)}</dd></div>
						</dl>
						<a href={compressedUrl} download={`${file.name.replace(/\.[^.]+$/, "")}-compressed.mp4`} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]"><FiDownload aria-hidden="true" />Download MP4</a>
					</section>
				)}
				{!isProcessing && status && <p role="status" className="text-sm text-[#28734a]">{status}</p>}
			</div>
		</ToolPageLayout>
	)
}

export default CompressVideo