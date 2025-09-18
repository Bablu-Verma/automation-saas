"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ServiceCard, ServiceCardProps } from "@/components/ServiceCard"


// Mock data
const mockServices: ServiceCardProps[] = [
  {
    title: "CRM Automation",
    desc: "Automate your customer workflows and save time.",
    image: "/service.jpg",
    link: "/services/crm-automation",
  },
  {
    title: "E-Commerce Workflows",
    desc: "Sync orders, inventory, and invoices effortlessly.",
    image: "/service.jpg",
    link: "/services/ecommerce",
  },
  {
    title: "Marketing Campaigns",
    desc: "Automate emails, ads, and customer engagement.",
    image: "/service.jpg",
    link: "/services/marketing",
  },
  {
    title: "Analytics Dashboard",
    desc: "Track performance and generate smart reports.",
    image: "/service.jpg",
    link: "/services/analytics",
  },
  {
    title: "Integration Tools",
    desc: "Connect multiple apps seamlessly without code.",
    image: "/service.jpg",
    link: "/services/integrations",
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ServiceCardProps[]>([])
  const [loading, setLoading] = useState(false)

  const debounceDelay = 300
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      performSearch(val)
    }, debounceDelay)
  }

  const performSearch = (q: string) => {
    setLoading(true)
    setTimeout(() => {
      if (!q) {
        setResults([])
      } else {
        const filtered = mockServices.filter(
          (item) =>
            item.title.toLowerCase().includes(q.toLowerCase()) ||
            item.desc.toLowerCase().includes(q.toLowerCase())
        )
        setResults(filtered)
      }
      setLoading(false)
    }, 500)
  }

  const handleReset = () => {
    setQuery("")
    setResults(mockServices.slice(0, 5)) // show default items again
  }

  useEffect(() => {
    setResults(mockServices.slice(0, 5))
  }, [])

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Search Services
        </h1>
        <p className="mt-4 text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
          Find the automation solution you need. Start typing to search.
        </p>
      </motion.div>

      {/* Search Input + Reset Button */}
      <div className="max-w-2xl mx-auto flex items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by service name or keywords..."
          className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        {query && (
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
          >
            Reset
          </button>
        )}
      </div>

      {/* Search Results */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg rounded-3xl h-56 animate-pulse"
            />
          ))
        ) : results.length > 0 ? (
          results.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ServiceCard {...item} />
            </motion.div>
          ))
        ) : (
          <p className="text-center text-white/70 col-span-full mt-8">
            No results found for “
            <span className="font-semibold text-white">{query}</span>”
          </p>
        )}
      </div>
    </section>
  )
}
