import { useEffect, useState } from "react"
import { FiDownload, FiMusic, FiRefreshCw, FiUploadCloud } from "react-icons/fi"
import ToolPageLayout from "./ToolPageLayout"
import { MAX_VIDEO_FILE_SIZE, runVideoTranscode } from "../lib/videoFfmpeg"

const formatBytes = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`

function VideoToAudio() {
	const [file, setFile] = useState(null)
	const [previewUrl, setPreviewUrl] = useState("")
	const [audioUrl, setAudioUrl] = useState("")
	const [audioSize, setAudioSize] = useState(0)
	const [isProcessing, setIsProcessing] = useState(false)
	const [progress, setProgress] = useState(0)
	const [status, setStatus] = useState("")
	const [error, setError] = useState("")

	useEffect(() => () => {
		if (previewUrl) URL.revokeObjectURL(previewUrl)
	}, [previewUrl])

	useEffect(() => () => {
		if (audioUrl) URL.revokeObjectURL(audioUrl)
	}, [audioUrl])

	function chooseFile(nextFile) {
		setError("")
		setStatus("")
		setAudioUrl("")
		setAudioSize(0)
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

	async function convert() {
		if (!file) return
		setIsProcessing(true)
		setError("")
		setStatus("Preparing conversion...")
		setProgress(0)
		try {
			const { bytes } = await runVideoTranscode(
				file,
				"audio.wav",
				["-vn", "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2"],
				setProgress,
				setStatus,
			)
			setAudioSize(bytes.byteLength)
			setAudioUrl(URL.createObjectURL(new Blob([bytes], { type: "audio/wav" })))
			setStatus("Audio extracted successfully. The WAV file is ready to download.")
		} catch (conversionError) {
			setError(conversionError.message || "Could not extract audio. The video may use an unsupported codec or have no audio track.")
			setStatus("")
		} finally {
			setIsProcessing(false)
		}
	}

	function reset() {
		setFile(null)
		setPreviewUrl("")
		setAudioUrl("")
		setAudioSize(0)
		setError("")
		setStatus("")
		setProgress(0)
	}

	return (
		<ToolPageLayout title="Video to Audio" description="Extract a WAV audio track from a video entirely in your browser." Icon={FiMusic}>
			<div className="space-y-6">
				<label className="flex min-h-44 cursor-pointer flex-col items-center justify-center border border-dashed border-[#b9cbea] bg-[#f7faff] p-6 text-center sm:p-10">
					<FiUploadCloud aria-hidden="true" className="text-4xl text-[#2563eb]" />
					<span className="mt-4 text-base font-medium text-[#20271f]">Choose a video file</span>
					<span className="mt-2 text-sm text-[#5d665f]">MP4, WebM, or MOV · up to 100 MB · processed on this device</span>
					<input type="file" accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime" className="sr-only" disabled={isProcessing} onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = "" }} />
				</label>

				{file && (
					<section className="min-w-0 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Selected video">
						<div className="mb-4 min-w-0">
							<h2 className="truncate text-lg font-semibold text-[#20271f]">{file.name}</h2>
							<p className="mt-1 text-sm text-[#5d665f]">{formatBytes(file.size)}</p>
						</div>
						<video controls preload="metadata" src={previewUrl} onError={() => setError("This browser cannot preview the video. Conversion may still work if its codec is supported.")} className="max-h-96 w-full bg-black" />
					</section>
				)}

				<div className="flex flex-wrap gap-3">
					<button type="button" onClick={convert} disabled={!file || isProcessing} className="min-h-12 bg-[#1d4ed8] px-6 text-sm font-semibold text-white hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60">
						{isProcessing ? "Converting..." : "Convert to Audio"}
					</button>
					<button type="button" onClick={reset} disabled={isProcessing} className="inline-flex min-h-12 items-center gap-2 border border-[#dbe7fb] px-6 text-sm font-semibold text-[#20271f] hover:bg-[#f7faff]">
						<FiRefreshCw aria-hidden="true" />Reset
					</button>
				</div>

				{isProcessing && (
					<div role="status" className="space-y-2">
						<p className="text-sm text-[#5d665f]">{status} {progress}%</p>
						<progress className="h-2 w-full accent-[#1d4ed8]" max="100" value={progress} aria-label="Audio extraction progress" />
					</div>
				)}
				{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
				{audioUrl && (
					<section className="space-y-4 border border-[#dbe7fb] bg-white p-5 sm:p-6" aria-label="Audio result">
						<h2 className="text-lg font-semibold text-[#20271f]">Extracted audio · WAV</h2>
						<p className="text-sm text-[#5d665f]">Output size: {formatBytes(audioSize)}</p>
						<audio controls src={audioUrl} className="w-full" />
						<a href={audioUrl} download={`${file.name.replace(/\.[^.]+$/, "")}.wav`} className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#1d4ed8] px-5 text-sm font-semibold text-white hover:bg-[#1e40af]"><FiDownload aria-hidden="true" />Download WAV</a>
					</section>
				)}
				{!isProcessing && status && <p role="status" className="text-sm text-[#28734a]">{status}</p>}
			</div>
		</ToolPageLayout>
	)
}

export default VideoToAudio