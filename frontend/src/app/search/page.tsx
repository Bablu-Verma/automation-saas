"use client"

import { useState, useEffect, useRef } from "react"
// Framer Motion removed from imports
import { ServiceCard } from "@/components/ServiceCard"
import { search_api } from "@/api"
import axios from "axios"
import { Workflow__ } from "../admin/service/list/page" // Assuming the type import is correct

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Workflow__[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const debounceDelay = 300
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    setPage(1)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      performSearch(val, 1)
    }, debounceDelay)
  }

  const performSearch = async (q: string, pageNumber = 1) => {
    setLoading(true)
    try {
      const { data } = await axios.post(search_api, {
        search: q,
        page: pageNumber,
        limit: 12, // number of items per page
      })
      setResults(data.workflows)
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error("Failed to fetch workflows:", err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuery("")
    setResults([])
    setPage(1)
    performSearch("", 1)
  }

  // Optional: fetch initial workflows on mount
  useEffect(() => {
    performSearch("", 1)
  }, [])

  // --- Reusable Input Class ---
  const inputClasses = `
    flex-1 px-6 py-3 rounded-full transition border-2 focus:outline-none focus:ring-2 focus:ring-primary
    
    /* Light Mode Input */
    bg-lightBg text-textLight border-textLight/20 placeholder-textLight/60
    
    /* Dark Mode Input */
    dark:bg-darkBg dark:text-textDark dark:border-textDark/20 dark:placeholder-textDark/60
  `;

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      {/* Header (Framer Motion removed) */}
      <div
        className="text-center mb-12"
      >
        {/* H1 Theming */}
        <h1 className="text-4xl md:text-5xl font-extrabold 
          text-textLight dark:text-textDark transition-colors duration-500">
          Search Services
        </h1>
        {/* Paragraph Theming */}
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto
          text-textLight/80 dark:text-textDark/80 transition-colors duration-500">
          Find the automation solution you need. Start typing to search.
        </p>
      </div>

      {/* Search Input + Reset */}
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by service name or keywords..."
          className={inputClasses}
        />
        {query && (
          <button
            onClick={handleReset}
            // Reset button is themed to Primary/Secondary for consistency
            className="px-5 py-2 rounded-full bg-secondary text-white font-semibold shadow-md hover:bg-primary transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Search Results */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Skeleton Loader Theming
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl h-56 animate-pulse 
                bg-textLight/10 dark:bg-textDark/10"
            />
          ))
        ) : results.length > 0 ? (
          results.map((item, i) => (
            // Framer Motion removed, standard div used with CSS transition
            <div
              key={i}
              className="transition-transform duration-300 hover:scale-[1.02]"
            >
              <ServiceCard workflows={item} />
            </div>
          ))
        ) : (
          // No Results Text Theming
          <p className="text-center col-span-full mt-8 
            text-textLight/70 dark:text-textDark/70">
            No results found for “
            <span className="font-semibold text-textLight dark:text-textDark">{query}</span>”
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-4">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPage(idx + 1)
                performSearch(query, idx + 1)
              }}
              className={`px-4 py-2 rounded-full transition ${
                page === idx + 1
                  ? "bg-primary text-white font-semibold"
                  : "bg-textLight/10 dark:bg-textDark/10 text-textLight/70 dark:text-textDark/70 hover:bg-primary/20"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}