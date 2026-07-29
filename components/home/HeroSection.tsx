"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import homeData from "@/content/beranda/main.json";

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
    <section className="relative min-h-[calc(100vh+88px)] sm:min-h-[calc(100vh+96px)] -mt-[88px] sm:-mt-[96px] overflow-hidden flex flex-col justify-center">
      {/* Background image extended upwards */}
      <div
        className="absolute -top-16 inset-x-0 bottom-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal green-black overlay 80% extended upwards */}
      <div className="absolute -top-16 inset-x-0 bottom-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

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
          className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
        >
          {homeData.titleLine1 || "Jamaah Nurul Huda"}
        </motion.p>
        <motion.p 
          variants={itemVariants}
          className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl mt-2"
        >
          {homeData.titleLine2 || "Unit Kegiatan Mahasiswa Islam"}
        </motion.p>
        <motion.div variants={itemVariants}>
          <Link
            href={homeData.universityUrl || "https://uns.ac.id"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-3 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {homeData.university || "Universitas Sebelas Maret"}
          </Link>
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
          width={400}
          height={400}
          className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
          priority
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
          width={400}
          height={400}
          className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
          priority
        />
      </motion.div>
    </section>
  );
}
