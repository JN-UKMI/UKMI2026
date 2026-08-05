"use client";

import { Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { y: 16, scale: 0.98 }}
      whileInView={shouldReduceMotion ? undefined : { y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
    >
      <Info className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </motion.div>
  );
}
