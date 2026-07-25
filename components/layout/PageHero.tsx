"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
  return (
    <section className="relative min-h-[320px] md:min-h-[380px] -mt-[80px] overflow-hidden flex items-center justify-center py-16 px-4">
      {/* Background image */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal green-black overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-forest-900/85 to-black/90" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-lime/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-4xl mx-auto pt-[60px]"
      >
        {badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="px-3.5 py-1 mb-3 bg-lime/20 border border-lime/40 rounded-full text-lime text-xs font-bold uppercase tracking-wider"
          >
            {badge}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase drop-shadow-sm"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-sm md:text-base text-white/80 mt-3 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Accent Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "4rem" }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="h-1 bg-lime rounded-full mt-4 shadow-sm opacity-90"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          <Image
            src="/image/logo-jnukmi.svg"
            alt="JN UKMI Logo"
            width={40}
            height={40}
            className="mt-6 h-auto w-8 md:w-9"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
