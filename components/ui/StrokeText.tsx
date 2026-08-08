"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useInView } from "framer-motion";
import "./StrokeText.css";

const DEFAULT_TEXT = "Draw Attention";

type StrokeTextTrigger = "mount" | "hover" | "scroll" | "loop";
type StrokeTextFillMode = "fade" | "wipe" | "none";

export interface StrokeTextProps {
  text?: string;
  strokeColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: StrokeTextTrigger;
  fillMode?: StrokeTextFillMode;
  fontSize?: number | string;
  fontWeight?: number | string;
  letterSpacing?: number | string;
  reverse?: boolean;
  startDelay?: number;
  decorative?: boolean;
  className?: string;
  style?: CSSProperties;
}

const easeMap: Record<string, string> = {
  "power2.out": "cubic-bezier(0, 0, 0.2, 1)",
  "power2.inOut": "cubic-bezier(0.4, 0, 0.2, 1)",
  "power2.in": "cubic-bezier(0.4, 0, 1, 1)",
};

export function StrokeText({
  text = DEFAULT_TEXT,
  strokeColor = "#A78BFA",
  fillColor = "#F8FAFC",
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = "power2.out",
  trigger = "mount",
  fillMode = "wipe",
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  reverse = false,
  startDelay = 0,
  decorative = false,
  className = "",
  style = {},
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const rawId = useId();
  const wipeId = `stroke-text-wipe-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const characters = useMemo(() => Array.from(String(text ?? "")), [text]);
  const numericFontSize = typeof fontSize === "number" ? fontSize : parseFloat(fontSize) || 128;
  const dash = Math.max(numericFontSize * 7, 200);
  const fontSizeValue = typeof fontSize === "number" ? `${fontSize}px` : fontSize;
  const letterSpacingValue =
    typeof letterSpacing === "number" ? `${letterSpacing}px` : letterSpacing;

  const fontStyle = useMemo(
    () => ({
      fontSize: fontSizeValue,
      fontWeight,
      letterSpacing: letterSpacingValue,
    }),
    [fontSizeValue, fontWeight, letterSpacingValue]
  );

  useLayoutEffect(() => {
    const node = strokeTextRef.current;
    if (!node) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;

      let bbox: DOMRect;
      try {
        bbox = strokeTextRef.current.getBBox();
      } catch {
        return;
      }

      if (!bbox.width || !bbox.height) return;

      const pad = Math.max(Number(strokeWidth) || 1, numericFontSize * 0.1);
      const next = {
        x: bbox.x - pad,
        y: bbox.y - pad,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2,
      };

      setBox((previous) =>
        previous &&
        Math.abs(previous.x - next.x) < 0.5 &&
        Math.abs(previous.y - next.y) < 0.5 &&
        Math.abs(previous.width - next.width) < 0.5 &&
        Math.abs(previous.height - next.height) < 0.5
          ? previous
          : next
      );
    };

    measure();
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => undefined);
    }

    return () => {
      cancelled = true;
    };
  }, [characters, numericFontSize, fontSize, fontWeight, letterSpacing, strokeWidth]);

  const isInView = useInView(rootRef, { once: trigger !== "loop", margin: "0px 0px -18% 0px" });
  const [playCount, setPlayCount] = useState(1);
  const [hoverCount, setHoverCount] = useState(0);

  const fillDuration = Math.max(0.4, drawDuration * 0.5);

  useEffect(() => {
    if (trigger === "loop") {
      const totalTime =
        (startDelay + characters.length * stagger + drawDuration + fillDelay + fillDuration + 0.9) *
        1000;
      const interval = setInterval(() => {
        setPlayCount((p) => p + 1);
      }, totalTime);
      return () => clearInterval(interval);
    }
  }, [trigger, startDelay, characters.length, stagger, drawDuration, fillDelay, fillDuration]);

  let isAnimating = false;
  let isFinished = false;

  if (trigger === "hover") {
    if (hoverCount === 0) {
      isFinished = true;
    } else {
      isAnimating = true;
    }
  } else if (trigger === "scroll") {
    isAnimating = isInView;
  } else if (trigger === "mount") {
    isAnimating = true;
  } else if (trigger === "loop") {
    isAnimating = true;
  }

  const animClass = isAnimating ? "is-animating" : isFinished ? "is-finished" : "";
  const keyToUse = trigger === "loop" ? playCount : trigger === "hover" ? hoverCount : 1;

  const viewBox = box
    ? `${box.x} ${box.y} ${box.width} ${box.height}`
    : `0 ${-numericFontSize} 600 ${numericFontSize * 1.3}`;

  const cssEase = easeMap[ease as string] || "cubic-bezier(0, 0, 0.2, 1)";

  const getStaggerDelay = (index: number) => {
    const i = reverse ? characters.length - 1 - index : index;
    return startDelay + i * stagger;
  };

  const handlePointerEnter = () => {
    if (trigger === "hover") setHoverCount((c) => c + 1);
  };

  return (
    <span
      ref={rootRef}
      className={`stroke-text ${trigger === "hover" ? "stroke-text--hover" : ""} ${className}`.trim()}
      style={
        {
          "--stroke-text-height": `${Math.round(numericFontSize * 1.3)}px`,
          ...style,
        } as CSSProperties
      }
      onPointerEnter={handlePointerEnter}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": String(text ?? "") })}
    >
      <svg
        key={keyToUse}
        className="stroke-text__svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {fillMode === "wipe" && box && (
          <defs>
            <clipPath id={wipeId} clipPathUnits="userSpaceOnUse">
              <rect
                className={`stroke-text__wipe-rect ${animClass}`}
                x={box.x}
                y={box.y}
                width="0"
                height={box.height}
                style={
                  {
                    "--wipe-width": `${box.width}px`,
                    "--delay": `${startDelay + drawDuration + fillDelay}s`,
                    "--fill-duration": `${fillDuration}s`,
                  } as CSSProperties
                }
              />
            </clipPath>
          </defs>
        )}

        <text
          ref={strokeTextRef}
          className="stroke-text__stroke"
          x="0"
          y="0"
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={fontStyle}
        >
          {characters.map((character, index) => (
            <tspan
              data-stroke-char
              key={`stroke-${index}`}
              className={`stroke-text__stroke-char ${animClass}`}
              style={
                {
                  "--dash": dash,
                  "--delay": `${getStaggerDelay(index)}s`,
                  "--draw-duration": `${drawDuration}s`,
                  "--ease": cssEase,
                } as CSSProperties
              }
            >
              {character}
            </tspan>
          ))}
        </text>

        <text
          className={`stroke-text__fill ${fillMode === "none" ? "opacity-0" : ""}`}
          x="0"
          y="0"
          fill={fillColor}
          stroke="none"
          style={{ ...fontStyle, opacity: fillMode === "none" ? 0 : 1 }}
          clipPath={fillMode === "wipe" && box ? `url(#${wipeId})` : undefined}
        >
          {characters.map((character, index) => (
            <tspan
              data-fill-char
              key={`fill-${index}`}
              className={fillMode === "fade" ? `stroke-text__fill-char--fade ${animClass}` : ""}
              style={
                fillMode === "fade"
                  ? ({
                      "--delay": `${getStaggerDelay(index) + drawDuration + fillDelay}s`,
                      "--fill-duration": `${fillDuration}s`,
                      "--ease": cssEase,
                    } as CSSProperties)
                  : undefined
              }
            >
              {character}
            </tspan>
          ))}
        </text>
      </svg>
    </span>
  );
}

export default StrokeText;
