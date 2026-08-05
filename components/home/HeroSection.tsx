"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import homeData from "@/content/beranda/main.json";
import { WordReveal, GradientText, MagneticButton, Parallax } from "@/components/ui/motion";

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
          alt="Hero JN UKMI UNS"
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
      <div className="pointer-events-none absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />

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
            alt="JN UKMI Logo"
            width={112}
            height={112}
            className="mb-8 h-auto w-24 md:w-28 opacity-75"
            priority
          />
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
        >
          {shouldReduceMotion ? (
            homeData.titleLine1 || "Jamaah Nurul Huda"
          ) : (
            <WordReveal text={homeData.titleLine1 || "Jamaah Nurul Huda"} />
          )}
        </motion.p>
        <motion.p 
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mt-1 sm:mt-2"
        >
          {shouldReduceMotion ? (
            homeData.titleLine2 || "Unit Kegiatan Mahasiswa Islam"
          ) : (
            <WordReveal text={homeData.titleLine2 || "Unit Kegiatan Mahasiswa Islam"} delay={0.15} />
          )}
        </motion.p>

        <motion.div variants={itemVariants} className="mt-10">
          <MagneticButton
            as="a"
            href={homeData.universityUrl || "https://uns.ac.id"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-7 py-3 text-sm font-semibold text-white/95 transition-colors duration-300 hover:bg-white/20 hover:border-white/50 cursor-pointer"
          >
            <GradientText colors="from-lime via-fresh-lime to-white" className="font-bold">
              {homeData.university || "Universitas Sebelas Maret"}
            </GradientText>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5">→</span>
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
