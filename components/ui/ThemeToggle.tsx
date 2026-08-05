"use client";

import { Sun, Moon } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={shouldReduceMotion ? undefined : { scale: 1.08, rotate: 3 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
      transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 22 }}
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={theme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-forest-600 dark:hover:text-lime transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 dark:focus-visible:ring-lime"
    >
      <motion.div
        key={theme}
        initial={shouldReduceMotion ? false : { rotate: -90, opacity: 0, scale: 0.6 }}
        animate={shouldReduceMotion ? undefined : { rotate: 0, opacity: 1, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
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
