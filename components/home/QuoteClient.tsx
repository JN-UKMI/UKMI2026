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
    <section className="relative bg-transparent transition-colors overflow-hidden">
      <div className="py-16 px-2 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="mx-auto bg-gradient-to-br from-forest-900 via-forest-800 to-black text-white rounded-2xl shadow-xl sm:mx-4 md:mx-8 lg:mx-20 overflow-hidden relative"
        >
          {/* Decorative Glowing Ambient Orbs */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lime/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          {/* Main Card Container */}
          <div className="p-8 md:p-10 lg:p-12 pb-10 md:pb-12 lg:pb-14 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ x: 24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-4 text-center max-w-3xl mx-auto"
              >
                {/* Arabic Text */}
                <p
                  className="font-uthmanic text-2xl md:text-3xl leading-[2.6] text-white/95"
                  dir="rtl"
                  lang="ar"
                >
                  {currentQuote.arabic}
                </p>

                {/* Separator */}
                <div className="w-[75%] max-w-xs h-px bg-white/20 my-1" />

                {/* Translation Text */}
                <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-2xl font-medium">
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
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40 z-20">
            <div
              key={index}
              aria-hidden="true"
              className="quote-progress h-full w-full bg-gradient-to-r from-forest-400 via-lime to-emerald-400 shadow-[0_0_12px_rgba(163,230,53,0.8)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
