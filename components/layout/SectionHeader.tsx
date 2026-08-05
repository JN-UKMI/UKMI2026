"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TextReveal } from "@/components/ui/motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, icon, className = "" }: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center text-center mb-10 ${className}`}
    >
      {/* 1. Top Icon Container — double-bezel premium */}
      {icon && (
        <motion.div
          initial={{ scale: 0.6, rotate: -12 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.12, rotate: 8 }}
          className="w-14 h-14 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center mb-4 border border-forest-600/20 dark:border-forest-800 shadow-sm transition-colors relative group"
        >
          {/* Glow halo saat hover */}
          <div className="absolute inset-0 rounded-2xl bg-forest-600/0 group-hover:bg-forest-600/10 dark:group-hover:bg-lime/10 transition-colors duration-300" />
          <span className="relative">{icon}</span>
        </motion.div>
      )}

      {/* 2. Main Title — reveal per kata */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-forest-900 dark:text-lime uppercase tracking-wider">
        {shouldReduceMotion ? (
          title
        ) : (
          <TextReveal text={title} stagger={0.035} />
        )}
      </h2>

      {/* 3. Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium leading-relaxed mt-2"
        >
          {subtitle}
        </motion.p>
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
