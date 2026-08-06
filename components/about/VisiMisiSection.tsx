"use client";

import { FadeIn } from "@/components/ui/motion";

interface VisiMisiSectionProps {
  visi: string;
  misi: string;
}

export function VisiMisiSection({ visi, misi }: VisiMisiSectionProps) {
  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center">
            <h2 className="section-title-hover text-3xl font-bold text-forest-900 mb-8">
              Visi
            </h2>
            <p className="text-lg text-muted dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              {visi}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-4 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center" direction="up" delay={0.1}>
            <h2 className="section-title-hover text-3xl font-bold text-forest-900 mb-8">
              Misi
            </h2>
            <p className="text-lg text-muted dark:text-gray-300 leading-relaxed">
              {misi}
            </p>
          </FadeIn>
        </div>
      </section>
    </>
  );
}