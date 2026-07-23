"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Quote {
  arabic: string;
  translation: string;
  source: string;
}

export function QuoteClient({ quotes }: { quotes: Quote[] }) {
  const [index, setIndex] = useState(0);
  const currentQuote = quotes[index];

  // Rotate quotes every 30 seconds
  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [quotes]);

  if (!currentQuote) return null;

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="py-16 px-2 sm:px-4">
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="mx-auto bg-gradient-to-r from-forest-800 via-forest-600 to-forest-800 rounded-2xl shadow-xl sm:mx-4 md:mx-8 lg:mx-20 overflow-hidden relative"
        >
          {/* Main Card Container */}
          <div className="p-8 md:p-10 lg:p-12 pb-10 md:pb-12 lg:pb-14 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4 text-center max-w-3xl mx-auto"
              >
                {/* Arabic Text */}
                <p
                  className="text-xl md:text-2xl leading-relaxed text-white/90 font-serif"
                  dir="rtl"
                  lang="ar"
                >
                  {currentQuote.arabic}
                </p>

                {/* Separator */}
                <div className="w-[75%] max-w-xs h-px bg-white/20 my-1" />

                {/* Translation Text */}
                <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl font-medium">
                  &ldquo;{currentQuote.translation}&rdquo;
                </p>

                {/* Source */}
                <p className="text-xs text-lime font-bold tracking-wide">
                  {currentQuote.source}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 30 Seconds Duration Loading Indicator Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-forest-900/40 z-20">
            <motion.div
              key={index} // Reset animation key when index changes
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 30, // 30 seconds duration matching the quote rotation interval
                ease: "linear",
              }}
              className="h-full bg-lime/90"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
