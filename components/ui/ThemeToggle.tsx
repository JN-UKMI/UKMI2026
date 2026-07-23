"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={theme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-forest-600 dark:hover:text-lime transition-all duration-200 cursor-pointer active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
      ) : (
        <Moon className="w-4 h-4 text-forest-700 stroke-[2.5]" />
      )}
    </button>
  );
}
