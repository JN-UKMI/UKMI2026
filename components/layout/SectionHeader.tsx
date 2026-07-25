"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, icon, className = "" }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`flex flex-col items-center text-center mb-10 ${className}`}
    >
      {/* 1. Top Icon Container */}
      {icon && (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 6 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-12 h-12 bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime rounded-2xl flex items-center justify-center mb-3 border border-forest-600/20 dark:border-forest-800 shadow-sm transition-colors"
        >
          {icon}
        </motion.div>
      )}

      {/* 2. Main Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-forest-900 dark:text-lime uppercase tracking-wider">
        {title}
      </h2>

      {/* 3. Subtitle */}
      {subtitle && (
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium leading-relaxed mt-2">
          {subtitle}
        </p>
      )}

      {/* 4. Bottom Lime Accent Bar */}
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "3.5rem" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-1 bg-lime rounded-full mt-3 shadow-sm opacity-90"
      />
    </motion.div>
  );
}
