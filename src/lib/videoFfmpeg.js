import ffmpegCoreURL from "@ffmpeg/core?url"
import ffmpegWasmURL from "@ffmpeg/core/wasm?url"

export const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024

export function getVideoExtension(file) {
	const match = file.name.match(/\.([a-z0-9]+)$/i)
	return match ? match[1].toLowerCase() : "mp4"
}

async function probeMedia(ffmpeg, inputName, fileSize, recentLogs, requireVideo = true) {
	recentLogs.length = 0
	await ffmpeg.exec(["-i", inputName], -1)
	const log = recentLogs.join("\n")
	const videoLine = log.split("\n").find((line) => /Video:/i.test(line))
	const resolution = videoLine?.match(/(\d{2,5})x(\d{2,5})/)
	if (!videoLine || !resolution) {
		if (!requireVideo && /Audio:/i.test(log)) {
			return { width: 0, height: 0, videoBitrate: 0, audioBitrate: 0, duration: 0 }
		}
		throw new Error("Could not inspect this video. Check that it contains a supported video stream.")
	}
	const durationMatch = log.match(/Duration:\s*(\d+):(\d+):([\d.]+)/)
	const duration = durationMatch
		? Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3])
		: 0
	const streamBitrate = videoLine.match(/([\d.]+)\s*(k|M)?b\/s/i)
	const bitrateScale = streamBitrate?.[2]?.toLowerCase() === "m" ? 1000000 : streamBitrate?.[2] ? 1000 : 1
	const totalBitrate = duration ? (fileSize * 8) / duration : 0
	const hasAudio = /Audio:/i.test(log)
	const audioLine = log.split("\n").find((line) => /Audio:/i.test(line))
	const audioMatch = audioLine?.match(/([\d.]+)\s*(k|M)?b\/s/i)
	const audioScale = audioMatch?.[2]?.toLowerCase() === "m" ? 1000000 : audioMatch?.[2] ? 1000 : 1
	const audioBitrate = audioMatch ? Number(audioMatch[1]) * audioScale : 0
	const estimatedAudioBitrate = audioBitrate || (hasAudio ? Math.min(128000, totalBitrate * 0.8) : 0)
	const estimatedVideoBitrate = totalBitrate
		? Math.max(1, totalBitrate - estimatedAudioBitrate) * 0.85
		: 0

	return {
		width: Number(resolution[1]),
		height: Number(resolution[2]),
		videoBitrate: (streamBitrate ? Number(streamBitrate[1]) * bitrateScale : 0) || estimatedVideoBitrate,
		audioBitrate,
		duration,
	}
}

export async function runVideoTranscode(file, outputName, createArgs, onProgress, onStatus) {
	const { FFmpeg } = await import("@ffmpeg/ffmpeg")
	const ffmpeg = new FFmpeg()
	const inputName = `input.${getVideoExtension(file)}`
	const recentLogs = []
	const handleProgress = ({ progress }) => onProgress(Math.min(99, Math.max(0, Math.round(progress * 100))))
	const handleLog = ({ message }) => {
		recentLogs.push(message)
		if (recentLogs.length > 100) recentLogs.shift()
	}
	ffmpeg.on("progress", handleProgress)
	ffmpeg.on("log", handleLog)

	try {
		onStatus("Loading the local video engine...")
		await ffmpeg.load({ coreURL: ffmpegCoreURL, wasmURL: ffmpegWasmURL })
		onStatus("Reading video into browser memory...")
		await ffmpeg.writeFile(inputName, new Uint8Array(await file.arrayBuffer()))
		onStatus("Inspecting source resolution and bitrates...")
		const sourceMetadata = await probeMedia(ffmpeg, inputName, file.size, recentLogs)
		onStatus("Processing video locally...")
		const args = typeof createArgs === "function" ? createArgs(sourceMetadata) : createArgs
		const exitCode = await ffmpeg.exec(["-i", inputName, ...args, outputName], -1)
		if (exitCode !== 0) {
			throw new Error(
				"Could not process this video. Check that the file is valid and uses a supported codec.",
				{ cause: recentLogs.slice(-6).join(" | ") },
			)
		}
		const output = await ffmpeg.readFile(outputName)
		const outputMetadata = await probeMedia(ffmpeg, outputName, output.byteLength, recentLogs, false)
		onProgress(100)
		return { bytes: new Uint8Array(output), sourceMetadata, outputMetadata }
	} finally {
		ffmpeg.off("progress", handleProgress)
		ffmpeg.off("log", handleLog)
		ffmpeg.terminate()
	}
}