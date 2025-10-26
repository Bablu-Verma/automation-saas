"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";


interface KeywordInputProps {
  keywords: string[];
  setKeywords: (keywords: string[]) => void;
}

export default function KeywordInput({ keywords, setKeywords }: KeywordInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addKeyword = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
    }
    setInputValue("");
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold">Keywords</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a keyword and press Enter"
          className="flex-1 border rounded-lg p-2"
        />
        <button
          type="button"
          onClick={addKeyword}
          className="bg-primary text-white px-4 rounded-lg hover:shadow-md"
        >
          Add
        </button>
      </div>

      {/* Show keywords as chips */}
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, idx) => (
          <span
            key={idx}
            className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
          >
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(idx)}
              className="text-red-600 hover:text-red-800"
            >
              <IoClose size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
