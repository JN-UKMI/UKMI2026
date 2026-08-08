"use client";

import React, {
  ReactNode,
  useRef,
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
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const EASE_SOFT = [0.21, 0.47, 0.32, 0.98] as const;

const MOTION_PRESETS = {
  interactive: {
    type: "spring",
    stiffness: 220,
    damping: 18,
    mass: 0.6,
  },
} as const;

// ── 1. FadeIn Scroll / Mount Component ──────────────────────────────
export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance: distanceProp = 24,
  viewportOnce = true,
  className = "",
  ...props
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  distance?: number;
  viewportOnce?: boolean;
  className?: string;
} & HTMLMotionProps<"div">) {
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

// ── 2. StaggerContainer & StaggerItem ───────────────────────────────
export function StaggerContainer({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  className = "",
  viewportOnce = true,
  ...props
}: {
  children: ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  className?: string;
  viewportOnce?: boolean;
} & HTMLMotionProps<"div">) {
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

export function StaggerItem({
  children,
  direction = "up",
  distance: distanceProp = 20,
  className = "",
  ...props
}: {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
} & HTMLMotionProps<"div">) {
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
  direction: "up" | "down" | "left" | "right" | "none" | undefined,
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

// ── 3. WordReveal (slide-up per word — lebih sinematik) ────────────
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

// ── 4. GradientText (teks dengan gradient animated) ────────────────
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

// ── 5. MagneticButton (tombol "menarik" kursor saat hover) ─────────
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

// ── 6. ShimmerOverlay (Aceternity-inspired hover light sweep) ──────
// Lightweight CSS-driven feedback: no pointer listeners and no React state.
export function ShimmerOverlay({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 -left-1/2 z-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover/card:translate-x-[430%] group-hover/card:opacity-100 motion-reduce:!translate-x-0 motion-reduce:!opacity-0 motion-reduce:transition-none ${className}`}
    />
  );
}

// ── 7. CardMotion (Interactive Card Wrapper) ─────────────────────────
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

// ── 8. SpotlightCard (border menyala mengikuti kursor) ─────────────
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
      <div className="relative z-[1] h-full flex flex-col flex-1 w-full">{children}</div>
    </div>
  );
}

// ── 9. Parallax (elemen bergerak halus saat scroll) ─────────────────
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

// ── 10. AmbientBackground (Global Static Ambient Mesh, Stars & Clean Orbs) ──────────
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

// ── 11. GrainOverlay (tekstur grain halus di seluruh halaman) ───────
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
