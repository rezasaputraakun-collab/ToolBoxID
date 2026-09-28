export const toolCategories = [
	{
		name: "Image Tools",
		slug: "image",
		description: "Compress, resize, and convert your images.",
		icon: "image",
		tools: [
			{ name: "Compress Image", route: "/tools/compress-image", description: "Reduce image file size while keeping it clear.", keywords: ["compress", "compression", "photo", "picture", "image size"] },
			{ name: "Resize Image", route: "/tools/resize-image", description: "Resize an image to fit your needs.", keywords: ["resize", "dimensions", "photo", "picture", "image size"] },
		],
	},
	{
		name: "Media Tools",
		slug: "media",
		description: "Prepare video and audio files for everyday use.",
		icon: "media",
		tools: [
			{ name: "Video → Audio", route: "/tools/video-to-audio", description: "Extract an audio track from a video file in your browser.", keywords: ["video", "audio", "video to audio", "extract", "convert", "wav"] },
			{ name: "Compress Video", route: "/tools/compress-video", description: "Compress a video locally with adjustable quality.", keywords: ["video", "compress", "compression", "mp4"] },
		],
	},
	{
		name: "PDF Tools",
		slug: "pdf",
		description: "Convert, organize, and manage PDF files.",
		icon: "pdf",
		tools: [
			{ name: "JPG → PDF", route: "/tools/jpg-to-pdf", description: "Convert JPG images into a PDF document.", keywords: ["jpg", "jpeg", "convert", "document"] },
			{ name: "Merge PDF", route: "/tools/merge-pdf", description: "Combine multiple PDF files into one.", keywords: ["merge", "combine", "join", "document"] },
		],
	},
	{
		name: "Text Tools",
		slug: "text",
		description: "Count, edit, and transform text with ease.",
		icon: "text",
		tools: [
			{ name: "Word Counter", route: "/tools/word-counter", description: "Count words in your text instantly.", keywords: ["words", "writing", "count", "document"] },
			{ name: "Character Counter", route: "/tools/character-counter", description: "Check the character count of any text.", keywords: ["characters", "letter", "text", "count"] },
		],
	},
	{
		name: "Developer Tools",
		slug: "developer",
		description: "Helpful utilities for code and data formats.",
		icon: "developer",
		tools: [
			{ name: "JSON Formatter", route: "/tools/json-formatter", description: "Format JSON to make it easier to read.", keywords: ["json", "format", "code", "developer", "data"] },
			{ name: "Base64 Encoder", route: "/tools/base64", description: "Encode text into Base64 format.", keywords: ["base64", "encode", "decode", "developer", "code"] },
		],
	},
	{
		name: "Utility Tools",
		slug: "utility",
		description: "Simple everyday utilities, all in one place.",
		icon: "utility",
		tools: [
			{ name: "QR Code Generator", route: "/tools/qr-generator", description: "Create a QR code for a link or text.", keywords: ["qr", "code", "url", "link", "generator"] },
			{ name: "Barcode Generator", route: "/tools/barcode-generator", description: "Generate and download a barcode from text or numbers.", keywords: ["barcode", "code", "generator", "code128"] },
		],
	},
]

const toolSearchData = toolCategories.flatMap(({ name: category, slug: categorySlug, tools }) =>
	tools.map((tool) => ({ ...tool, category, categorySlug, keywords: tool.keywords || [] })),
)

export default toolSearchData
