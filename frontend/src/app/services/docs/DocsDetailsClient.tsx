"use client";

import { useState, useEffect } from "react";
// Framer Motion removed from imports
import Link from "next/link";
import SubHero from "@/components/SubHero";

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

// Generate heading numbering function remains the same
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
    // Theming for Docs Not Found text
    return <p className="text-center text-textLight dark:text-textDark mt-28">Docs not found.</p>;
  }

  return (
    <section className="pt-28 px-4 sm:px-6 max-w-7xl mx-auto transition-colors duration-500">


      <SubHero title={`Documentation: ${docs.service_id.name}`} description={""} />

 
      {docs.docs && (
        <div className="mt-10 flex flex-col-reverse md:flex-row gap-10">

          <div
            className={`dangerouslyHTML flex-1`}
            dangerouslySetInnerHTML={{ __html: docs.docs }}
          />

          {/* SIDEBAR (RESPONSIVE - Themed) */}
          <div 
            className="w-full md:w-[25%] md:sticky max-h-[40vh] md:max-h-[90vh] md:top-[50px] overflow-auto rounded-lg
              
              /* Sidebar Theming (Glassmorphism) */
              bg-lightBg/60 backdrop-blur-md border border-textLight/10 text-textLight
              dark:bg-darkBg/60 dark:border-textDark/10 dark:text-textDark
              p-4"
          >

            <h2 className="text-xl font-bold mb-3 text-textLight dark:text-textDark">On This Docs</h2>
            
            <ul className="space-y-2">
              {headings.map((h) => (
                <li
                  key={h.id}
                  onClick={() => scrollToHeading(h.id)}
                  className={`cursor-pointer font-light text-base transition-colors duration-300 hover:text-primary 
                    ${
                      h.level === 1
                        ? "font-bold text-textLight dark:text-textDark"
                        : h.level === 2
                        ? "ml-2"
                        : h.level === 3
                        ? "ml-4"
                        : "ml-6"
                    }`}
                >
                  <span className="mr-2 text-primary/70">{h.numbering}</span>
                  <span className="hover:underline">{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

     <section className="relative pt-28 pb-24 px-6 text-center ">

 

  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-textLight dark:text-textDark">
    Need Help Getting Started?
  </h2>

  <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-textLight/80 dark:text-textDark/80">
    Not sure where to begin? Our experts will guide you — from setup to scaling your automation smoothly.
  </p>

  <div className="mt-10 flex flex-wrap items-center justify-center gap-5">

   
    <Link
      href="/contact"
      className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary 
                 text-white font-semibold shadow-md hover:shadow-xl 
                 transition duration-300 hover:scale-105"
    >
      Get Free Consultation
    </Link>

   
    <Link
    
      href={`/faq`}
      className="px-8 py-3 rounded-full border border-textLight/30 dark:border-textDark/30
                 text-textLight dark:text-textDark font-semibold
                 hover:bg-textLight/5 dark:hover:bg-textDark/5
                 transition duration-300"
    >
      View FAQs
    </Link>

  </div>

</section>

    </section>
  );
}