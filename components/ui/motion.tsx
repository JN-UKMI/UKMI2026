"use client";

import React, { ReactNode } from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";

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
  distance = 24,
  viewportOnce = true,
  className = "",
  ...props
}: FadeInProps) {
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
      viewport={{ once: viewportOnce, margin: "-60px" }}
      transition={{
        duration,
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
  const containerVariants: Variants = {
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
      initial="hidden"
      whileInView="show"
      viewport={{ once: viewportOnce, margin: "-60px" }}
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
  distance = 20,
  className = "",
  ...props
}: StaggerItemProps) {
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, ...getInitialPosition() },
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: viewportOnce, margin: "-60px" }}
      transition={{
        duration,
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
  const words = text.split(" ");

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
  return (
    <motion.button
      whileHover={hoverLift ? { y: -2, scale: 1.01 } : { scale: 1.01 }}
      whileTap={{ scale: 0.96 }}
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
  return (
    <motion.div
      whileHover={
        hoverLift
          ? {
              y: liftDistance,
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
      whileTap={{ scale: 0.99 }}
      className={`transition-shadow duration-300 ${
        glowOnHover ? "hover:shadow-xl hover:shadow-forest-900/5 dark:hover:shadow-lime/10" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 7. AmbientBackground (Clean Edge Safe-Zone Ambient Mesh & Inner Bubbles) ───
export function AmbientBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Inner Left Glowing Ambient Orb */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-forest-600/20 dark:bg-lime/20 blur-3xl"
      />

      {/* 2. Center Glowing Ambient Orb */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          scale: [1, 1.15, 0.92, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-emerald-500/20 dark:bg-fresh-lime/20 blur-3xl"
      />

      {/* 3. Safe-Zone Inner Floating Multi-Tone Green Bubbles (Strictly away from top & bottom edges) */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-12 w-40 h-40 rounded-full border-2 border-forest-600/25 dark:border-lime/35 bg-gradient-to-tr from-forest-600/15 via-sage/10 to-transparent"
      />
      <motion.div
        animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-14 w-52 h-52 rounded-full border-2 border-fresh-lime/30 dark:border-lime/40 bg-gradient-to-br from-fresh-lime/20 via-yellow-green/10 to-transparent"
      />
      <motion.div
        animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-16 w-36 h-36 rounded-full border-2 border-teal/30 dark:border-lime/35 bg-gradient-to-bl from-teal/20 via-forest-400/15 to-transparent"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute bottom-24 right-1/4 w-44 h-44 rounded-full border-2 border-grass/30 dark:border-lime/35 bg-gradient-to-tr from-grass/20 via-sage/15 to-transparent"
      />
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-20 left-1/3 w-36 h-36 rounded-full border-2 border-lime/35 dark:border-lime/45 bg-gradient-to-tl from-lime/25 via-forest-600/15 to-transparent"
      />
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
