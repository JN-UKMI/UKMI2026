"use client";

import React, {
  ReactNode,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  motion,
  HTMLMotionProps,
  Variants,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useIsTouchDevice } from "@/lib/hooks";

// ── 0. Shared Easing Curves ──────────────────────────────────────────
export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.21, 0.47, 0.32, 0.98] as const;

/** Shared motion presets keep the large motion layer coherent across pages. */
export const MOTION_PRESETS = {
  reveal: {
    duration: 0.55,
    ease: EASE_SOFT,
  },
  card: {
    type: "spring",
    stiffness: 320,
    damping: 24,
  },
  interactive: {
    type: "spring",
    stiffness: 220,
    damping: 18,
    mass: 0.6,
  },
} as const;

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
      initial={shouldReduceMotion ? false : initial}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={
        shouldReduceMotion
          ? undefined
          : { once: viewportOnce, margin: "-60px" }
      }
      transition={{
        duration: shouldReduceMotion ? 0.15 : duration,
        delay,
        ease: EASE_SOFT,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ── 1b. RevealFade (slide-in premium entry) ──────────────────────────
export function RevealFade({
  children,
  delay = 0,
  duration = 0.7,
  y = 40,
  blur: _blur = 0,
  className = "",
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  /** @deprecated Blur is ignored; entrance motion is slide-only. */
  blur?: number;
  className?: string;
} & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();
  void _blur;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={shouldReduceMotion ? undefined : { once: true, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0.15 : duration,
        delay,
        ease: EASE_PREMIUM,
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
            ease: EASE_SOFT,
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

// ── 3. SlideIn Component ────────────────────────────────────────────
// ScaleIn remains as a compatibility export; entrance motion is now slide-based.
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  slideDistance = 24,
  initialScale,
  className = "",
  viewportOnce = true,
  ...props
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  slideDistance?: number;
  /** @deprecated Use slideDistance. Kept for backwards compatibility. */
  initialScale?: number;
  className?: string;
  viewportOnce?: boolean;
} & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedSlideDistance = initialScale === undefined
    ? slideDistance
    : Math.max(16, (1 - initialScale) * 100);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: resolvedSlideDistance }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={
        shouldReduceMotion
          ? undefined
          : { once: viewportOnce, margin: "-60px" }
      }
      transition={{
        duration: shouldReduceMotion ? 0.15 : duration,
        delay,
        ease: EASE_SOFT,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Semantic name for slide-based entrance animation. */
export const SlideIn = ScaleIn;

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
        ease: EASE_SOFT,
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
      {words.map((word, i) => (          <motion.span
            key={`${word}-${i}`}
            variants={wordVariants}
            className={`inline-block ${i < words.length - 1 ? "mr-[0.25em]" : ""}`}
          >
            {word}
          </motion.span>
      ))}
    </motion.span>
  );
}

// ── 4b. WordReveal (slide-up per word — lebih sinematik) ────────────
export function WordReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.045,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: EASE_PREMIUM,
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
        <motion.span
          key={`${word}-${i}`}
          variants={wordVariants}
          className="inline-block will-change-transform"
          style={{ marginRight: i < words.length - 1 ? "0.22em" : undefined }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ── 4c. GradientText (teks dengan gradient animated) ────────────────
export function GradientText({
  children,
  className = "",
  colors = "from-forest-600 via-emerald-500 to-lime",
  animate = true,
}: {
  children: ReactNode;
  className?: string;
  colors?: string;
  animate?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={`bg-gradient-to-r ${colors} bg-clip-text text-transparent ${
        animate && !shouldReduceMotion
          ? "bg-[length:200%_auto] animate-gradient-x"
          : ""
      } ${className}`}
    >
      {children}
    </span>
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

// ── 5b. MagneticButton (tombol "menarik" kursor saat hover) ─────────
export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  as = "button",
  ...props
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
} & Record<string, unknown>) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MOTION_PRESETS.interactive);
  const springY = useSpring(y, MOTION_PRESETS.interactive);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (shouldReduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * strength);
      y.set((e.clientY - rect.top - rect.height / 2) * strength);
    },
    [shouldReduceMotion, strength, x, y]
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const motionProps = {
    ref,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: shouldReduceMotion ? undefined : { x: springX, y: springY },
    whileTap: shouldReduceMotion ? undefined : { scale: 0.94 },
    transition: MOTION_PRESETS.interactive,
    className,
  };

  const Comp = motion[as] as React.ElementType;
  return <Comp {...motionProps} {...props}>{children}</Comp>;
}

// ── 5c. ShimmerOverlay (Aceternity-inspired hover light sweep) ──────
// Lightweight CSS-driven feedback: no pointer listeners and no React state.
export function ShimmerOverlay({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover/card:translate-x-[430%] group-hover/card:opacity-100 motion-reduce:!translate-x-0 motion-reduce:!opacity-0 motion-reduce:transition-none ${className}`}
    />
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

// ── 6b. TiltCard (efek 3D tilt mengikuti kursor) ────────────────────
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const springGlareX = useSpring(glareX, { stiffness: 260, damping: 24 });
  const springGlareY = useSpring(glareY, { stiffness: 260, damping: 24 });
  const springGlareOpacity = useSpring(glareOpacity, { stiffness: 280, damping: 26 });
  const glareBackground = useTransform(
    [springGlareX, springGlareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.22), transparent 55%)`
  );

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (shouldReduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rotateX.set((0.5 - py) * maxTilt);
      rotateY.set((px - 0.5) * maxTilt);
      glareX.set(px * 100);
      glareY.set(py * 100);
      glareOpacity.set(1);
    },
    [glareOpacity, glareX, glareY, maxTilt, rotateX, rotateY, shouldReduceMotion]
  );

  const handleLeave = useCallback(() => {
    if (shouldReduceMotion) return;
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }, [glareOpacity, rotateX, rotateY, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        shouldReduceMotion
          ? undefined
          : {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
            }
      }
      className={`relative ${className}`}
    >
      {children}
      {glare && !shouldReduceMotion && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{
              opacity: springGlareOpacity,
              background: glareBackground,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ── 6c. SpotlightCard (border menyala mengikuti kursor) ─────────────
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(73,154,19,0.16)",
}: {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spotlightX = useMotionValue(-200);
  const spotlightY = useMotionValue(-200);
  const spotlightOpacity = useMotionValue(0);
  const springX = useSpring(spotlightX, { stiffness: 260, damping: 24 });
  const springY = useSpring(spotlightY, { stiffness: 260, damping: 24 });
  const springOpacity = useSpring(spotlightOpacity, { stiffness: 280, damping: 26 });
  const shouldReduceMotion = useReducedMotion();
  const isTouchDevice = useIsTouchDevice();
  const spotlightDisabled = shouldReduceMotion || isTouchDevice;
  const spotlightBackground = useTransform(
    [springX, springY],
    ([x, y]) => `radial-gradient(320px circle at ${x}px ${y}px, ${spotlightColor}, transparent 65%)`
  );

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (spotlightDisabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
    spotlightOpacity.set(1);
  }, [spotlightDisabled, spotlightOpacity, spotlightX, spotlightY]);

  const handleLeave = useCallback(() => {
    spotlightOpacity.set(0);
  }, [spotlightOpacity]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {!spotlightDisabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: springOpacity as unknown as number,
            background: spotlightBackground as unknown as string,
          }}
        />
      )}
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}

// ── 7. Parallax (elemen bergerak halus saat scroll) ─────────────────
export function Parallax({
  children,
  className = "",
  speed = 0.15,
  direction = "y",
}: {
  children: ReactNode;
  className?: string;
  /** Kecepatan relatif terhadap scroll. 0.1–0.3 halus, negatif = berlawanan. */
  speed?: number;
  direction?: "y" | "x";
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [speed * 100, speed * -100]);
  const spring = useSpring(raw, {
    stiffness: 90,
    damping: 22,
    mass: 0.4,
  });
  // Saat reduce-motion, kunci nilai ke 0 lewat transform (bukan kondisi di useSpring)
  const y = useTransform(spring, (v) => (shouldReduceMotion ? 0 : v));

  return (
    <motion.div
      ref={ref}
      style={direction === "y" ? { y } : { x: y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── 8. AmbientBackground (Global Static Ambient Mesh, Stars & Clean Orbs) ──────────
export function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Top Left Glowing Ambient Orb */}
      <div className="absolute top-10 -left-32 w-[28rem] md:w-[32rem] h-[28rem] md:h-[32rem] rounded-full bg-forest-600/15 dark:bg-lime/15 blur-3xl" />

      {/* 2. Center Glowing Ambient Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] md:w-[36rem] h-[30rem] md:h-[36rem] rounded-full bg-emerald-500/10 dark:bg-fresh-lime/15 blur-3xl" />

      {/* 3. Bottom Right Glowing Ambient Orb */}
      <div className="absolute -bottom-20 -right-32 w-[28rem] md:w-[32rem] h-[28rem] md:h-[32rem] rounded-full bg-teal/15 dark:bg-lime/15 blur-3xl" />

      {/* 4. Subtle Clean Decorative Bubbles — Single Solid Color */}
      <div className="hidden lg:block absolute top-24 left-16 w-40 h-40 rounded-full bg-forest-600/15 dark:bg-lime/25" />
      <div className="hidden lg:block absolute top-1/3 right-16 w-52 h-52 rounded-full bg-fresh-lime/15 dark:bg-lime/25" />
      <div className="hidden lg:block absolute top-[42%] left-[30%] w-32 h-32 rounded-full bg-forest-400/15 dark:bg-lime/20" />
      <div className="hidden lg:block absolute top-[52%] right-[28%] w-48 h-48 rounded-full bg-sage/15 dark:bg-lime/25" />
      <div className="hidden lg:block absolute top-2/3 left-20 w-36 h-36 rounded-full bg-teal/15 dark:bg-lime/25" />
      <div className="hidden lg:block absolute bottom-28 right-1/4 w-44 h-44 rounded-full bg-grass/15 dark:bg-lime/25" />

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

// ── 9. SectionDivider (Elegant Soft Line & Glow Separator) ───────────
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-6xl mx-auto my-12 sm:my-16 px-4 ${className}`}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-12 h-2 rounded-full bg-lime/20 blur-sm pointer-events-none" />
    </div>
  );
}

// ── 10. GrainOverlay (tekstur grain halus di seluruh halaman) ───────
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

// ── 11. NumberTicker (angka menghitung naik saat terlihat) ──────────
export function NumberTicker({
  value,
  duration = 1.6,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let start: number | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const step = (ts: number) => {
            if (start === null) start = ts;
            const progress = Math.min((ts - start) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration, shouldReduceMotion]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {(shouldReduceMotion ? value : display).toLocaleString("id-ID")}
    </span>
  );
}
