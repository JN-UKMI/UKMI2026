"use client";

import { FadeIn } from "@/components/ui/motion";

interface DeskripsiSectionProps {
  deskripsi: string;
}

export function DeskripsiSection({ deskripsi }: DeskripsiSectionProps) {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <FadeIn>
        <h2 className="text-2xl font-bold text-forest-900 dark:text-lime mb-6">Tentang Bidang</h2>
        <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">{deskripsi}</p>
      </FadeIn>
    </section>
  );
}
