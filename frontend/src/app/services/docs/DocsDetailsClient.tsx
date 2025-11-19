"use client";

import { RootState } from "@/redux-store/redux_store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { motion } from "framer-motion";

export interface ServiceInfo {
  _id: string;
  name: string;
}

export interface DataItem {
  _id: string;
  service_id: ServiceInfo;
  docs: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DocsDetailsClientProps {
  initialDoc: DataItem;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
  numbering: string;
}

// Generate heading numbering
function generateNumbering(headings: { level: number }[]) {
  const counters: number[] = [];

  return headings.map((h) => {
    const levelIndex = h.level - 1;

    counters.length = h.level;
    counters[levelIndex] = (counters[levelIndex] || 0) + 1;

    for (let i = levelIndex + 1; i < counters.length; i++) {
      counters[i] = 0;
    }

    return counters.slice(0, h.level).join(".");
  });
}

export default function DocsDetailsClient({ initialDoc }: DocsDetailsClientProps) {
  const [docs] = useState(initialDoc);
  const [headings, setHeadings] = useState<HeadingItem[]>([]);

  useEffect(() => {
    if (!docs.docs) return;

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(docs.docs, "text/html");

    const found = Array.from(
      htmlDoc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ).map((el) => ({
      id: el.id || "",
      text: el.textContent?.trim() || "",
      level: Number(el.tagName.replace("H", "")),
    }));

    const numbering = generateNumbering(found);

    const merged = found.map((h, i) => ({
      ...h,
      numbering: numbering[i],
    }));

    setHeadings(merged);
  }, [docs.docs]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!docs) {
    return <p className="text-center text-white mt-28">Docs not found.</p>;
  }

  return (
    <section className="py-28 px-4 sm:px-6 max-w-7xl mx-auto">

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
        <div className="w-full lg:w-1/2 text-white flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            {docs.service_id.name}
          </h1>
        </div>
      </div>

      {/* Docs + Sidebar */}
      {docs.docs && (
        <div className="mt-10 flex flex-col-reverse md:flex-row gap-10">

          {/* DOCS HTML CONTENT */}
          <div
            className="dangerouslyHTML flex-1"
            dangerouslySetInnerHTML={{ __html: docs.docs }}
          />

          {/* SIDEBAR (RESPONSIVE) */}
          <div className="w-full md:w-[25%] md:sticky max-h-[40vh] md:max-h-[90vh]  md:top-[50px] 
                          border border-white p-4 text-white overflow-auto rounded-lg">

            <h2 className="text-xl font-bold mb-3">On This Docs</h2>
            

            <ul className="space-y-2">
              {headings.map((h) => (
                <li
                  key={h.id}
                  onClick={() => scrollToHeading(h.id)}
                  className={`cursor-pointer font-light text-base hover:text-blue-400 transition ${
                    h.level === 1
                      ? "font-bold"
                      : h.level === 2
                      ? "ml-2"
                      : h.level === 3
                      ? "ml-4"
                      : "ml-6"
                  }`}
                >
                  <span className="mr-2 text-blue-200">{h.numbering}</span>
                  <span className="hover:underline">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* CTA Section */}
      <section className="relative text-white pt-28 px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
        >
          Need Help Getting Started?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
        >
          Not sure where to begin? Our experts will guide you — from setup to
          scaling your automation smoothly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8"
        >
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-2xl transition duration-300 hover:from-secondary hover:to-primary text-lg"
          >
            Get Free Consultation
          </Link>
        </motion.div>
      </section>

    </section>
  );
}
