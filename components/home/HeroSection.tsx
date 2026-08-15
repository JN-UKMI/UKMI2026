"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import homeData from "@/content/beranda/main.json";
import { MagneticButton, Parallax } from "@/components/ui/motion";
import { StrokeText } from "@/components/ui/StrokeText";

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative min-h-[calc(100vh+8px)] sm:min-h-[calc(100vh+16px)] -mt-[88px] sm:-mt-[96px] overflow-hidden flex flex-col justify-center">
      {/* Background image extended upwards — Optimized Next.js Image for top LCP */}
      <Parallax speed={-0.08} className="absolute -top-16 inset-x-0 bottom-0">
        <Image
          src="/image/ukmi-hero.jpg"
          alt="Hero JN UKMI UNS — Unit Kegiatan Mahasiswa Islam Universitas Sebelas Maret"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center scale-110"
        />
      </Parallax>

      {/* Diagonal green-black overlay 80% extended upwards */}
      <div className="absolute -top-16 inset-x-0 bottom-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

      {/* Glow ambient orbs */}
      <div className="pointer-events-none absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-lime/10 dark:hidden blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 dark:hidden blur-3xl" />

      {/* Main Hero Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex flex-1 flex-col items-center justify-center px-4 pt-[96px] pb-12 text-center text-white z-10"
      >
        <motion.div
          variants={itemVariants}
          animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <Image
            src="/image/logo-jnukmi.svg"
            alt="Logo Resmi JN UKMI UNS Surakarta"
            width={112}
            height={112}
            className="mb-8 h-auto w-24 md:w-28 opacity-75"
            priority
          />
        </motion.div>

        {/* Semantic single <h1> — keep a real text name for assistive technology;
            the SVG lettering is the visual treatment layered on top. */}
        <motion.h1 variants={itemVariants} className="w-full max-w-6xl text-center">
          <span className="sr-only">
            {homeData.titleLine1 || "Jamaah Nurul Huda"} {homeData.titleLine2 || "Unit Kegiatan Mahasiswa Islam"}
          </span>
          <StrokeText
            decorative
            startDelay={0.45}
            text={homeData.titleLine1 || "Jamaah Nurul Huda"}
            strokeColor="#FFFFFF"
            fillColor="#F8FAFC"
            strokeWidth={1.8}
            drawDuration={1.5}
            fillDelay={0.08}
            stagger={0.045}
            ease="power2.out"
            trigger="mount"
            fillMode="wipe"
            fontSize={128}
            fontWeight={800}
            letterSpacing={-4}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              "--stroke-text-height": "clamp(3.25rem, 12vw, 8rem)",
            } as CSSProperties}
          />
          <span className="mt-0 block sm:mt-1">
            <StrokeText
              decorative
              startDelay={0.65}
              text={homeData.titleLine2 || "Unit Kegiatan Mahasiswa Islam"}
              strokeColor="#FFFFFF"
              fillColor="#F8FAFC"
              strokeWidth={1.8}
              drawDuration={1.8}
              fillDelay={0.12}
              stagger={0.04}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={128}
              fontWeight={800}
              letterSpacing={-4}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
              style={{
                "--stroke-text-height": "clamp(3.25rem, 12vw, 8rem)",
                } as CSSProperties}
            />
          </span>
        </motion.h1>

        <motion.div variants={itemVariants} className="mt-10">
          <MagneticButton
            as="a"
            href={homeData.universityUrl || "https://uns.ac.id"}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-lime/60 cursor-pointer"
          >
            <span className="font-bold text-white group-hover:text-lime transition-colors duration-200">
              {homeData.university || "Universitas Sebelas Maret"}
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Corner Decorations: Kiri Bawah & Kanan Bawah */}
      <motion.div
        initial={{ opacity: 0, x: "-100vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 25,
          damping: 18,
          duration: 1.8,
          delay: 0.8,
        }}
        className="absolute bottom-0 left-0 z-20 pointer-events-none w-32 sm:w-48 md:w-64 lg:w-80 max-w-[35vw]"
      >
        <Image
          src="/image/kiri.webp"
          alt="Dekorasi Kiri Bawah"
          width={320}
          height={320}
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 320px"
          className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: "100vw" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 25,
          damping: 18,
          duration: 1.8,
          delay: 0.8,
        }}
        className="absolute bottom-0 right-0 z-20 pointer-events-none w-32 sm:w-48 md:w-64 lg:w-80 max-w-[35vw]"
      >
        <Image
          src="/image/kanan.webp"
          alt="Dekorasi Kanan Bawah"
          width={320}
          height={320}
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 256px, 320px"
          className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
          loading="lazy"
        />
      </motion.div>
    </section>
  );
}
