"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import homeData from "@/content/beranda/main.json";

export function HeroSection() {
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
    hidden: { scale: 0.85, y: 40 },
    visible: {
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 16,
      },
    },
  };

  return (
    <section className="relative min-h-screen -mt-[80px] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal green-black overlay 80% */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-[80px] text-center text-white -mt-16"
      >
        <motion.div 
          variants={itemVariants}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
    </section>
  );
}
