"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Newspaper } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

const sections = [
  {
    icon: BookOpen,
    title: "Tentang JN UKMI",
    description:
      "Jamaah Nurul Huda Unit Kegiatan Mahasiswa Islam (JN UKMI) adalah organisasi kemahasiswaan di Universitas Sebelas Maret yang fokus pada pengembangan nilai-nilai keislaman.",
    href: "/tentang",
  },
  {
    icon: Calendar,
    title: "Program Kerja",
    description:
      "Berbagai program kerja unggulan yang dirancang untuk membina generasi qurani yang berilmu, beriman, dan berakhlak mulia.",
    href: "/kabinet",
  },
  {
    icon: Newspaper,
    title: "Artikel Terbaru",
    description:
      "Baca artikel dan berita terbaru seputar kegiatan JN UKMI, kajian keislaman, serta informasi kemahasiswaan terkini.",
    href: "/artikel",
  },
];

export function ContentColumns() {
  return (
    <section className="bg-white dark:bg-transparent px-4 py-20 transition-colors">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-forest-900 dark:text-lime md:text-4xl">
            Jelajahi Lebih Lanjut
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Temukan berbagai konten dan kegiatan inspiratif
          </p>
        </div>

        <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <StaggerItem
                key={section.title}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] active:scale-[0.99]"
              >
                {/* Image placeholder */}
                <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.04]">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.15)_1px,transparent_1px)] bg-[length:24px_24px]" />
                  </div>
                  <Icon className="relative h-16 w-16 text-gray-400 dark:text-gray-500" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6 transition-colors">
                  {/* Purple circle icon */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600/10 text-purple-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-forest-900 dark:text-lime">
                    {section.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-gray-600 dark:text-gray-300">
                    {section.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={section.href}
                      className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-purple-700 hover:gap-3 group"
                    >
                      Selengkapnya
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
