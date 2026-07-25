"use client";

import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={theme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-forest-600 dark:hover:text-lime transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center shadow-xs"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
        ) : (
          <Moon className="w-4 h-4 text-forest-700 stroke-[2.5]" />
        )}
      </motion.div>
    </motion.button>
  );
}
