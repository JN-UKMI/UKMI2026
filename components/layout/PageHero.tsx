"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { ReactNode } from "react";
import { useIsTouchDevice } from "@/lib/hooks";
import { WordReveal } from "@/components/ui/motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children?: ReactNode;
}

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const isCoarsePointer = useIsTouchDevice();
  const enableParallax = !shouldReduceMotion && !isCoarsePointer;
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 56]);

  return (
    <section className="relative min-h-[320px] md:min-h-[380px] -mt-[88px] sm:-mt-[96px] overflow-hidden flex items-center justify-center py-16 px-4">
      {/* Background image — parallax halus via scroll */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0.96 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          y: enableParallax ? backgroundY : 0,
          willChange: enableParallax ? "transform" : "auto",
        }}
        className="absolute -top-16 inset-x-0 bottom-0"
      >
        <Image
          src="/image/ukmi-hero.jpg"
          alt="Page Hero Background"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Diagonal green-black overlay */}
      <div className="absolute -top-16 inset-x-0 bottom-0 bg-gradient-to-br from-green-950/90 via-forest-900/85 to-black/90" />

      {/* Glow ambient orbs */}
      <div className="pointer-events-none absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-lime/10 dark:hidden blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-emerald-500/10 dark:hidden blur-3xl" />


      {/* Content */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-4xl mx-auto pt-[60px]"
      >

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 0.9, x: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.1, duration: 0.4 }}
          className="mb-4"
        >
          <Image
            src="/image/logo-jnukmi.svg"
            alt="JN UKMI Logo"
            width={48}
            height={48}
            className="h-auto w-10 md:w-12 drop-shadow-md"
            priority
          />
        </motion.div>

        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase drop-shadow-sm"
        >
          <WordReveal text={title} delay={0.2} />
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.25, duration: 0.5 }}
            className="text-sm md:text-base text-white/80 mt-3 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Accent Bar */}
        <motion.div
          initial={shouldReduceMotion ? false : { width: 0 }}
          animate={shouldReduceMotion ? undefined : { width: "4rem" }}
          transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.35, duration: 0.5 }}
          className="h-1 bg-lime rounded-full mt-4 shadow-sm opacity-90"
        />

        {children && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.4, duration: 0.5 }}
            className="mt-5"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
