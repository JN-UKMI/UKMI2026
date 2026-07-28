"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps, Variants, useReducedMotion } from "framer-motion";

// ── 1. FadeIn Scroll / Mount Component ──────────────────────────────
export interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  viewportOnce?: boolean;
  className?: string;
}

export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance: distanceProp = 24,
  viewportOnce = true,
  className = "",
  ...props
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const distance = shouldReduceMotion ? 0 : distanceProp;

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initial = {
    opacity: 0,
    ...getInitialPosition(),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={
        shouldReduceMotion
          ? undefined
          : { once: viewportOnce, margin: "-60px" }
      }
      transition={{
        duration: shouldReduceMotion ? 0.15 : duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 2. StaggerContainer & StaggerItem ───────────────────────────────
export interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
  viewportOnce?: boolean;
}

export function StaggerContainer({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  className = "",
  viewportOnce = true,
  ...props
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }
    : {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      };

  return (
    <motion.div
      variants={containerVariants}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "show"}
      viewport={
        shouldReduceMotion ? undefined : { once: viewportOnce, margin: "-60px" }
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
}

export function StaggerItem({
  children,
  direction = "up",
  distance: distanceProp = 20,
  className = "",
  ...props
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const distance = shouldReduceMotion ? 0 : distanceProp;

  const itemVariants: Variants = shouldReduceMotion
    ? {
        hidden: { opacity: 1, x: 0, y: 0 },
        show: { opacity: 1, x: 0, y: 0 },
      }
    : {
        hidden: { opacity: 0, ...getInitialPosition(direction, distance) },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
}

function getInitialPosition(
  direction: StaggerItemProps["direction"],
  distance: number
) {
  switch (direction) {
    case "up":
      return { y: distance, x: 0 };
    case "down":
      return { y: -distance, x: 0 };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "none":
    default:
      return { x: 0, y: 0 };
  }
}

// ── 3. ScaleIn Component ────────────────────────────────────────────
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  initialScale = 0.94,
  className = "",
  viewportOnce = true,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
  viewportOnce?: boolean;
} & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: shouldReduceMotion ? 1 : initialScale,
      }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={
        shouldReduceMotion
          ? undefined
          : { once: viewportOnce, margin: "-60px" }
      }
      transition={{
        duration: shouldReduceMotion ? 0.15 : duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 4. TextReveal (Word-by-word reveal for titles) ──────────────────
export function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={`inline-block ${className}`}
    >
      {words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={wordVariants} className="inline-block mr-[0.25em]">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── 5. ButtonMotion & Micro-Interaction Wrapper ─────────────────────
export function ButtonMotion({
  children,
  className = "",
  hoverLift = true,
  onClick,
  ...props
}: {
  children: ReactNode;
  className?: string;
  hoverLift?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & HTMLMotionProps<"button">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      whileHover={
        shouldReduceMotion
          ? undefined
          : hoverLift
          ? { y: -2, scale: 1.01 }
          : { scale: 1.01 }
      }
      whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// ── 6. CardMotion (Interactive Card Wrapper) ─────────────────────────
export function CardMotion({
  children,
  className = "",
  hoverLift = true,
  liftDistance = -4,
  glowOnHover = true,
  ...props
}: {
  children: ReactNode;
  className?: string;
  hoverLift?: boolean;
  liftDistance?: number;
  glowOnHover?: boolean;
} & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        shouldReduceMotion
          ? undefined
          : hoverLift
          ? {
              y: liftDistance,
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      className={`transition-shadow duration-300 ${
        glowOnHover ? "hover:shadow-xl hover:shadow-forest-900/5 dark:hover:shadow-lime/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 7. AmbientBackground (Global Static Ambient Mesh, Stars & Clean Orbs) ──────────
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Top Left Glowing Ambient Orb */}
      <div className="absolute top-10 -left-32 w-[28rem] md:w-[32rem] h-[28rem] md:h-[32rem] rounded-full bg-forest-600/15 dark:bg-lime/15 blur-3xl" />

      {/* 2. Center Glowing Ambient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] md:w-[36rem] h-[30rem] md:h-[36rem] rounded-full bg-emerald-500/10 dark:bg-fresh-lime/15 blur-3xl" />

      {/* 3. Bottom Right Glowing Ambient Orb */}
      <div className="absolute -bottom-20 -right-32 w-[28rem] md:w-[32rem] h-[28rem] md:h-[32rem] rounded-full bg-teal/15 dark:bg-lime/15 blur-3xl" />

      {/* 4. Subtle Clean Decorative Bubbles (Desktop only) */}
      <div className="hidden lg:block absolute top-24 left-16 w-40 h-40 rounded-full border-2 border-forest-600/20 dark:border-lime/30 bg-gradient-to-tr from-forest-600/10 via-sage/5 to-transparent" />
      <div className="hidden lg:block absolute top-1/3 right-16 w-52 h-52 rounded-full border-2 border-fresh-lime/20 dark:border-lime/30 bg-gradient-to-br from-fresh-lime/15 via-yellow-green/5 to-transparent" />
      <div className="hidden lg:block absolute top-2/3 left-20 w-36 h-36 rounded-full border-2 border-teal/20 dark:border-lime/30 bg-gradient-to-bl from-teal/15 via-forest-400/10 to-transparent" />
      <div className="hidden lg:block absolute bottom-28 right-1/4 w-44 h-44 rounded-full border-2 border-grass/20 dark:border-lime/30 bg-gradient-to-tr from-grass/15 via-sage/10 to-transparent" />

      {/* 5. Decorative Plain Stars (Bintang Polos 4-Point & 8-Point Minimalis) */}
      {/* Star Top Right */}
      <div className="absolute top-16 right-[12%] text-forest-600/25 dark:text-lime/35">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Star Top Left */}
      <div className="absolute top-36 left-[8%] text-forest-600/20 dark:text-lime/30">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Star Mid Right */}
      <div className="absolute top-1/2 right-[6%] -translate-y-12 text-forest-600/20 dark:text-lime/30">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Star Mid Left */}
      <div className="absolute top-2/3 left-[12%] text-forest-600/25 dark:text-lime/35">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Star Bottom Right */}
      <div className="absolute bottom-20 right-[15%] text-forest-600/20 dark:text-lime/30">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Star Bottom Left */}
      <div className="absolute bottom-36 left-[5%] text-forest-600/25 dark:text-lime/35">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    </div>
  );
}

// ── 8. SectionDivider (Elegant Soft Line & Glow Separator) ───────────
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-6xl mx-auto my-12 sm:my-16 px-4 ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-12 h-2 rounded-full bg-lime/20 blur-sm pointer-events-none" />
    </div>
  );
}
