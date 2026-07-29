"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";

interface LogoKabinetSectionProps {
  filosofi?: string;
}

export function LogoKabinetSection({ filosofi }: LogoKabinetSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-colors">
        {/* Logo Image */}
        <div className="relative shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800/60 p-6 rounded-[10px] border border-gray-100 dark:border-gray-750 group overflow-hidden">
          <div className="absolute inset-0 bg-forest-600/5 dark:bg-lime/5 rounded-[10px] blur-xl group-hover:bg-forest-600/10 dark:group-hover:bg-lime/10 transition-colors pointer-events-none" />
          <Image
            src="/image/Kabinet-Iskandar-Muda.webp"
            alt="Logo Kabinet Iskandar Muda JN UKMI"
            width={340}
            height={340}
            className="w-56 sm:w-64 md:w-72 h-auto object-contain rounded-[10px] drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        {/* Logo Info & Philosophy */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-50 dark:bg-forest-950/60 text-forest-700 dark:text-lime border border-forest-200/80 dark:border-forest-800 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-forest-600 dark:text-lime" />
            Filosofi Logo
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-forest-900 dark:text-white tracking-tight leading-snug">
            Kabinet Iskandar Muda
          </h2>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            {filosofi ||
              "Logo kami mencerminkan nilai-nilai keislaman, persatuan, dan semangat dakwah yang bersinar terang di kalangan mahasiswa Universitas Sebelas Maret."}
          </p>
        </div>
      </div>
    </section>
  );
}
