"use client";

import { FadeIn } from "@/components/ui/motion";
import { Info } from "lucide-react";

interface DeskripsiSectionProps {
  deskripsi: string;
}

export function DeskripsiSection({ deskripsi }: DeskripsiSectionProps) {
  return (
    <section className="py-10 sm:py-12 px-4 max-w-5xl mx-auto">
      <FadeIn>
        <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-forest-600 dark:border-lime shadow-lg p-8 md:p-10 transition-colors">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-lime/10 dark:bg-lime/10">
              <Info className="w-5 h-5 text-forest-600 dark:text-lime" />
            </div>
            <h2 className="section-title-hover text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              Tentang Bidang
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base md:text-lg">
            {deskripsi}
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
