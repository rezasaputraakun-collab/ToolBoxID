import { useEffect, useRef, useState } from "react"
import Navbar from "./components/Navbar"
import Categories from "./components/Categories"
import AllTools from "./components/AllTools"
import PopulerTools from "./components/PopulerTools"
import Footer from "./components/Footer"
import { Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom"
import About from "./pages/About"
import Contact from "./pages/Contact"
import CompressImage from "./pages/CompressImage"
import ResizeImage from "./pages/ResizeImage"
import JpgToPdf from "./pages/JpgToPdf"
import MergePdf from "./pages/MergePdf"
import WordCounter from "./pages/WordCounter"
import CharacterCounter from "./pages/CharacterCounter"
import JsonFormatter from "./pages/JsonFormatter"
import Base64Encoder from "./pages/Base64Encoder"
import ColorConverter from "./pages/ColorConverter"
import ColorPaletteGenerator from "./pages/ColorPaletteGenerator"
import QrGenerator from "./pages/QrGenerator"
import UnitConverter from "./pages/UnitConverter"
import { FiSearch } from "react-icons/fi"
import { Link } from "react-router-dom"
import toolSearchData from "./data/toolSearchData"

function HomePage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get("category") || ""
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchContainerRef = useRef(null)
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()
  const searchResults = normalizedQuery
    ? toolSearchData.filter((tool) =>
      [tool.name, tool.category, ...tool.keywords]
        .join(" ")
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    )
    : []

  useEffect(() => {
    if (!location.hash) return
    const targetId = decodeURIComponent(location.hash.slice(1))
    requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView())
  }, [location.hash, location.key, selectedCategory])

  useEffect(() => {
    function handlePointerDown(event) {
      if (!searchContainerRef.current?.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsSearchOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#20271f]">
      <header className="mx-auto max-w-7xl px-6 md:px-10">
        <Navbar />
      </header>

      <main id="home">
        <section className="flex min-h-[68vh] items-center justify-center bg-white px-6 py-20 text-center md:px-10 md:py-28">
          <div className="mx-auto w-full max-w-7xl">
            <h1 className="mx-auto max-w-5xl bg-linear-to-r from-white via-[#60a5fa] to-[#1d4ed8] bg-clip-text font-serif text-6xl leading-[1.02] text-transparent drop-shadow-[0_2px_5px_rgba(37,99,235,0.55)] sm:text-7xl md:text-8xl">
              Your Digital ToolBoxID
            </h1>
            <p className="mt-6 text-lg text-[#394334] md:text-xl">
              Simple tools for everyday tasks.
            </p>

            <div ref={searchContainerRef} className="relative mx-auto mt-12 w-full max-w-xl text-left">
              <label className="flex h-14 w-full items-center gap-3 border border-[#20271f]/15 bg-white px-4 shadow-sm focus-within:border-[#20271f]/50">
                <FiSearch aria-hidden="true" className="shrink-0 text-xl text-[#596251]" />
                <input
                  type="search"
                  aria-label="Search for tools"
                  aria-autocomplete="list"
                  aria-expanded={Boolean(normalizedQuery && isSearchOpen)}
                  aria-controls="tool-search-results"
                  placeholder="Search for tools..."
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setIsSearchOpen(true)
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="h-full min-w-0 flex-1 bg-transparent text-base text-[#20271f] outline-none placeholder:text-[#788071]"
                />
              </label>

              {normalizedQuery && isSearchOpen && (
                <ul
                  id="tool-search-results"
                  role="listbox"
                  aria-label="Tool search results"
                  className="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto border border-[#dbe7fb] bg-white text-left shadow-lg"
                >
                  {searchResults.length ? searchResults.map((tool) => (
                    <li key={tool.route} role="option" aria-selected="false">
                      <Link
                        to={tool.route}
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery("")
                        }}
                        className="block border-b border-[#dbe7fb] px-4 py-3 last:border-b-0 hover:bg-[#f7faff] focus-visible:bg-[#f7faff] focus-visible:outline-none"
                      >
                        <span className="block text-sm font-semibold text-[#20271f]">{tool.name}</span>
                        <span className="mt-1 block text-xs text-[#5d665f]">{tool.category}</span>
                      </Link>
                    </li>
                  )) : (
                    <li className="px-4 py-3 text-sm text-[#5d665f]">No tools found.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </section>
        <PopulerTools />
        <Categories />
        <AllTools selectedCategory={selectedCategory} />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/tools/compress-image" element={<CompressImage />} />
      <Route path="/tools/resize-image" element={<ResizeImage />} />
      <Route path="/tools/jpg-to-pdf" element={<JpgToPdf />} />
      <Route path="/tools/merge-pdf" element={<MergePdf />} />
      <Route path="/tools/word-counter" element={<WordCounter />} />
      <Route path="/tools/character-counter" element={<CharacterCounter />} />
      <Route path="/tools/json-formatter" element={<JsonFormatter />} />
      <Route path="/tools/base64" element={<Base64Encoder />} />
      <Route path="/tools/color-converter" element={<ColorConverter />} />
      <Route path="/tools/color-palette-generator" element={<ColorPaletteGenerator />} />
      <Route path="/tools/qr-generator" element={<QrGenerator />} />
      <Route path="/tools/unit-converter" element={<UnitConverter />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App