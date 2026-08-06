"use client";

import Image from "next/image";
import { FadeIn } from "@/components/ui/motion";

interface LogoPhilosophySectionProps {
  logoPath?: string;
  filosofi: string;
}

export function LogoPhilosophySection({
  logoPath = "/image/logo-jnukmi.svg",
  filosofi,
}: LogoPhilosophySectionProps) {
  const hasLogo = logoPath !== "/placeholder.png";

  return (
    <section className="mb-12">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row gap-8 items-center p-8">
          <FadeIn direction="left" className="w-1/2 max-w-lg flex-shrink-0">
            <Image
              src={hasLogo ? logoPath : "/placeholder.png"}
              alt="Logo JN UKMI"
              width={200}
              height={200}
              className="mx-auto"
              unoptimized
            />
          </FadeIn>
          <FadeIn direction="right" delay={0.15} className="w-1/2">
            <h2 className="section-title-hover text-2xl font-bold text-gray-900 dark:text-white mb-4">Filosofi Logo</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {filosofi}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}