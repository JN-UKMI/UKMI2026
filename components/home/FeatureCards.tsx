"use client";

import { BookOpen, Heart, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, SpotlightCard } from "@/components/ui/motion";
import { TransitionLink } from "@/components/ui/TransitionLink";

const features = [
  {
    icon: BookOpen,
    title: "LDF & Doa",
    description:
      "Lembaga Dakwah Fakultas (LDF) binaan JN UKMI dan kumpulan doa harian, doa-doa pilihan untuk diamalkan sehari-hari dalam perkuliahan.",
    href: "/ldf",
    gridClass: "md:col-span-7",
    badge: "Sumber Daya Islami",
  },
  {
    icon: Heart,
    title: "Kajian Rutin",
    description:
      "Kajian rutin tiap pekan dengan tema aktual bersama pemateri ilmiah untuk membina fikrah dan spiritualitas mahasiswa.",
    href: "/artikel?category=Kajian",
    gridClass: "md:col-span-5",
    badge: "Pembinaan Moral",
  },
  {
    icon: Users,
    title: "Komunitas & Kebersamaan Ukhuwah",
    description:
      "Ruang berkolaborasi dan berkembang bersama jaringan mahasiswa muslim aktif se-Universitas Sebelas Maret.",
    href: "/tentang",
    gridClass: "md:col-span-12",
    badge: "Jaringan Aktivis",
  },
];

export function FeatureCards() {
  return (
    <section className="bg-gray-50 dark:bg-gray-950 transition-colors px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/80 dark:border-gray-800 pb-6"
        >
          <div>
            <h2 className="text-3xl font-black text-forest-900 dark:text-lime md:text-4xl tracking-tight">
              Layanan & Pembinaan
            </h2>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-300 max-w-xl">
              Fasilitas dan ekosistem dakwah kampus untuk menunjang kehidupan akademis & religius mahasiswa UNS.
            </p>
          </div>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title} className={feature.gridClass}>
                <TransitionLink href={feature.href} className="block h-full cursor-pointer group">
                  <SpotlightCard className="h-full rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900/90 shadow-sm transition-all duration-300 hover:border-forest-600/50 dark:hover:border-lime/50 hover:shadow-xl hover:shadow-forest-600/10 dark:hover:shadow-lime/10 hover:-translate-y-1.5 p-6 md:p-8">
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-forest-700 dark:text-lime">
                            <span className="p-1.5 rounded-lg bg-forest-600/10 dark:bg-forest-900/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                              <Icon className="w-4 h-4 text-forest-600 dark:text-lime" />
                            </span>
                            {feature.badge}
                          </span>
                          <span className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300 group-hover:bg-forest-600 group-hover:border-forest-600 dark:group-hover:bg-lime dark:group-hover:border-lime group-hover:text-white dark:group-hover:text-forest-950">
                            <ArrowUpRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-white dark:group-hover:text-forest-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                          </span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-forest-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
                          {feature.title}
                        </h3>
                        
                        <p className="mt-3 leading-relaxed text-sm text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>

                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-forest-600 dark:text-lime opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Jelajahi
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </SpotlightCard>
                </TransitionLink>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

