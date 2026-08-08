"use client";

import {
  Fragment,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import "./ScrollFloat.css";

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

export interface ScrollFloatProps {
  children: string | ReactNode;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: "easeIn" | "easeOut" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate" | [number, number, number, number];
  stagger?: number;
  delay?: number;
  distance?: number;
  amount?: "some" | "all" | number;
  margin?: string;
  once?: boolean;
  desktopOnly?: boolean;
}

/**
 * Reusable enter/leave text reveal.
 *
 * With `once={false}` (the default), every viewport crossing is animated:
 * characters enter from below, return to the hidden state on exit, and reveal
 * again when the user scrolls back. The desktop gate keeps mobile typography
 * stable and avoids unnecessary motion on touch devices.
 */
export function ScrollFloat({
  children,
  containerClassName = "",
  textClassName = "",
  animationDuration = 0.55,
  ease = "backOut",
  stagger = 0.045,
  delay = 0,
  distance = 18,
  amount = 0.25,
  // IntersectionObserver rootMargin requires pixel units for reliable
  // cross-browser behavior; percentages can silently disable the observer.
  margin = "0px 0px -80px 0px",
  once = false,
  desktopOnly = true,
}: ScrollFloatProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktopMotion = useSyncExternalStore(
    subscribeDesktopMotion,
    getDesktopMotionSnapshot,
    getDesktopMotionServerSnapshot
  );
  const shouldAnimate = !shouldReduceMotion && (!desktopOnly || isDesktopMotion);
  const text = typeof children === "string" ? children : null;

  // Animate words rather than individual characters so headings preserve
  // natural wrapping at desktop breakpoints and remain easy to read.
  const words = useMemo(
    () => (text ? text.trim().split(/\s+/) : []),
    [text]
  );

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: distance,
      scaleY: 1.08,
      transformOrigin: "50% 100%",
    },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: {
        duration: animationDuration,
        ease,
      },
    },
  };

  if (!shouldAnimate) {
    return (
      <span className={`scroll-float ${containerClassName}`.trim()}>
        <span className={`scroll-float__text ${textClassName}`.trim()}>
          {children}
        </span>
      </span>
    );
  }

  if (!text) {
    return (
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount, margin }}
        variants={containerVariants}
        className={`scroll-float ${containerClassName}`.trim()}
      >
        <span className={`scroll-float__text ${textClassName}`.trim()}>
          {children}
        </span>
      </motion.span>
    );
  }

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      variants={containerVariants}
      className={`scroll-float ${containerClassName}`.trim()}
    >
      <span className={`scroll-float__text ${textClassName}`.trim()}>
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <motion.span
              variants={wordVariants}
              className="scroll-float__word"
            >
              {word}
            </motion.span>
            {index < words.length - 1 && (
              <span className="scroll-float__space">{" "}</span>
            )}
          </Fragment>
        ))}
      </span>
    </motion.span>
  );
}

export default ScrollFloat;
