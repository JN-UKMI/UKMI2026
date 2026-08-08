"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScrollFloat } from "@/components/ui/ScrollFloat";

const DESKTOP_MOTION_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function subscribeDesktopMotion(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const media = window.matchMedia(DESKTOP_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getDesktopMotionSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(DESKTOP_MOTION_QUERY).matches;
}

function getDesktopMotionServerSnapshot() {
  return false;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, icon, className = "" }: SectionHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktopMotion = useSyncExternalStore(
    subscribeDesktopMotion,
    getDesktopMotionSnapshot,
    getDesktopMotionServerSnapshot
  );
  const animateSection = isDesktopMotion && !shouldReduceMotion;

  return (
    <motion.div
      initial={animateSection ? { opacity: 0, y: 20 } : false}
      whileInView={animateSection ? { opacity: 1, y: 0 } : undefined}
      viewport={animateSection ? { once: false, amount: 0.2, margin: "0px 0px -10% 0px" } : undefined}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col items-center text-center mb-10 ${className}`}
    >
      {/* 1. Top Icon Container — double-bezel premium */}
      {icon && (
        <motion.div
          initial={animateSection ? { opacity: 0, y: 16 } : false}
          whileInView={animateSection ? { opacity: 1, y: 0 } : undefined}
          viewport={animateSection ? { once: false, amount: 0.2, margin: "0px 0px -10% 0px" } : undefined}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={animateSection ? { scale: 1.12, rotate: 8 } : undefined}
          whileTap={animateSection ? { scale: 0.96 } : undefined}
          className="w-14 h-14 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center mb-4 border border-forest-600/20 dark:border-forest-800 shadow-sm transition-colors relative group"
        >
          {/* Glow halo saat hover */}
          <div className="absolute inset-0 rounded-2xl bg-forest-600/0 group-hover:bg-forest-600/10 dark:group-hover:bg-lime/10 transition-colors duration-300" />
          <span className="relative">{icon}</span>
        </motion.div>
      )}

      {/* 2. Main Title — reveal per kata */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-forest-900 dark:text-lime uppercase tracking-wider">
        <span className="section-title-hover">
          <ScrollFloat
            animationDuration={0.55}
            ease="backOut"
            stagger={0.045}
            delay={0.04}
            distance={18}
            amount={0.25}
            margin="0px 0px -80px 0px"
            once={false}
            desktopOnly
          >
            {title}
          </ScrollFloat>
        </span>
      </h2>

      {/* 3. Subtitle */}
      {subtitle && (
        <motion.p
          initial={animateSection ? { opacity: 0, y: 12 } : false}
          whileInView={animateSection ? { opacity: 1, y: 0 } : undefined}
          viewport={animateSection ? { once: false, amount: 0.2, margin: "0px 0px -10% 0px" } : undefined}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium leading-relaxed mt-2"
        >
          {subtitle}
        </motion.p>
      )}

      {/* 4. Bottom Lime Accent Bar */}
      <motion.div
        initial={animateSection ? { opacity: 0, x: -18 } : false}
        whileInView={animateSection ? { opacity: 1, x: 0 } : undefined}
        viewport={animateSection ? { once: false, amount: 0.2, margin: "0px 0px -10% 0px" } : undefined}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="h-1 bg-lime rounded-full mt-3 shadow-sm opacity-90"
      />
    </motion.div>
  );
}
