"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 top-0 left-0 w-full h-screen z-[99999] flex flex-col items-center justify-center bg-white dark:bg-gray-950 select-none overflow-hidden">
      {/* Outer center-aligned container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Core animating loader area */}
        <div className="relative h-48 w-48 flex items-center justify-center">
          {/* Single clean rotating segment loader ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute h-36 w-36 rounded-full border-4 border-gray-100 border-t-forest-700 border-r-lime"
          />

          {/* Center Logo with Scale Spring Pulse */}
          <motion.div
            animate={{
              scale: [0.95, 1.03, 0.95],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="z-10 flex h-28 w-28 items-center justify-center rounded-full bg-forest-50/50 backdrop-blur-xs border border-forest-100/60 shadow-[0_8px_30px_rgb(24,35,15,0.03)]"
          >
            <Image
              src="/image/logo-jnukmi.svg"
              alt="JN UKMI Loading Logo"
              width={112}
              height={112}
              className="h-auto w-16 opacity-95 drop-shadow-[0_4px_10px_rgba(24,35,15,0.08)]"
              priority
            />
          </motion.div>
        </div>

        {/* Bottom Loading Text with Kinetic Jump Animation */}
        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-1">
            <span className="text-xs font-black tracking-widest text-forest-800 uppercase">
              Loading
            </span>
            <div className="flex space-x-1 items-end h-3 pb-0.5">
              {[0, 1, 2].map((idx) => (
                <motion.span
                  key={idx}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.15,
                  }}
                  className="w-1.5 h-1.5 bg-lime rounded-full"
                />
              ))}
            </div>
          </div>
          <motion.p
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="mt-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-wide uppercase"
          >
            Jamaah Nurul Huda UKMI UNS
          </motion.p>
        </div>
      </div>
    </div>
  );
}
