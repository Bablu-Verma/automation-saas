import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export default function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Optional: auto-update if system theme changes
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("theme");
      if (saved !== "light" && saved !== "dark") {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    } 
    // Legacy browsers (deprecated but for compatibility)
    else if (media.addListener) {
      media.addListener(handler);
      return () => media.removeListener(handler);
    }
  }, []);

  const toggleTheme = (): void => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  };

  return [theme, toggleTheme];
}