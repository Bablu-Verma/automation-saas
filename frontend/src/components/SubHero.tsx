"use client";

import Image from "next/image";

export default function SubHero({
  title,
  description,
  image,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <section
      className="
        relative mb-28 py-24 px-6
        flex flex-col items-center justify-center text-center
        overflow-hidden
      "
    >
      {/* Optional Background Image */}
      {image && (
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <Image
            src={image}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1
          className="
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold leading-tight tracking-tight
            text-gray-900 dark:text-white
          "
        >
          {title || "Automate Smarter with AI Workflows"}
        </h1>

        <p
          className="
            mt-6 text-lg md:text-xl
            text-gray-600 dark:text-gray-300
            max-w-2xl mx-auto
          "
        >
          {description}
        </p>
      </div>
    </section>
  );
}