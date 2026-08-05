"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MagneticButton, Parallax, WordReveal } from "@/components/ui/motion";

interface HeroSectionProps {
  name: string;
  slug: string;
  instagram_url: string;
}

export function HeroSection({ name, instagram_url }: HeroSectionProps) {
  return (
    <section className="relative min-h-[320px] md:min-h-[380px] -mt-[88px] sm:-mt-[96px] overflow-hidden flex items-center justify-center py-16 px-4">
      {/* Background image with restrained parallax */}
      <Parallax speed={-0.06} className="absolute -top-16 inset-x-0 bottom-0">
        <Image
          src="/image/ukmi-hero.jpg"
          alt="Bidang Hero Background"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
      </Parallax>

      {/* Diagonal green-black overlay */}
      <div className="absolute -top-16 inset-x-0 bottom-0 bg-gradient-to-br from-green-950/90 via-forest-900/85 to-black/90" />
      <div className="pointer-events-none absolute -right-24 top-1/4 w-72 h-72 rounded-full bg-lime/10 blur-3xl" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-4xl mx-auto pt-[60px]"
      >
        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase drop-shadow-sm mb-4">
          <WordReveal text={name} delay={0.12} />
        </h1>

        <MagneticButton
          as="a"
          href={instagram_url || "#"}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-full font-bold transition-all text-xs shadow-md hover:shadow-pink-500/25 mb-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kunjungi Instagram <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
        </MagneticButton>

        {/* Accent Bar */}
        <div className="w-16 h-1 bg-lime rounded-full shadow-sm opacity-90" />

        <Image
          src="/image/logo-jnukmi.svg"
          alt="JN UKMI Logo"
          width={40}
          height={40}
          className="mt-6 h-auto w-8 md:w-9 opacity-40"
          priority
        />
      </motion.div>
    </section>
  );
}
