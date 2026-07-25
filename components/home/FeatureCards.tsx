"use client";

import { BookOpen, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem, CardMotion } from "@/components/ui/motion";
import { TransitionLink } from "@/components/ui/TransitionLink";

const features = [
  {
    icon: BookOpen,
    title: "LDF & Doa",
    description:
      "Lembaga Dakwah Fakultas (LDF) binaan JN UKMI dan kumpulan doa harian, doa-doa pilihan untuk diamalkan sehari-hari.",
    href: "/ldf",
  },
  {
    icon: Heart,
    title: "Kajian Rutin",
    description:
      "Ikuti kajian islami rutin setiap pekan. Berbagai tema menarik dari pembicara kompeten untuk menambah wawasan dan keimanan.",
    href: "/artikel?category=Kajian",
  },
  {
    icon: Users,
    title: "Komunitas",
    description:
      "Bergabung dengan komunitas mahasiswa islami yang aktif. Berbagi ilmu, pengalaman, dan kebersamaan dalam suasana ukhuwah.",
    href: "/tentang",
  },
];

export function FeatureCards() {
  return (
    <section className="bg-gray-50 dark:bg-gray-950 transition-colors px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-black text-forest-900 dark:text-lime md:text-4xl">
            Layanan Kami
          </h2>
          <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sumber daya islami & pembinaan spiritualitas untuk kehidupan mahasiswa UNS
          </p>
        </motion.div>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <StaggerItem key={feature.title}>
                <TransitionLink href={feature.href} className="block h-full cursor-pointer">
                  <CardMotion className="h-full rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm transition-all hover:border-forest-600/50 dark:hover:border-lime/50 group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100 dark:bg-forest-900/60 text-forest-700 dark:text-lime shadow-inner"
                    >
                      <Icon className="h-7 w-7" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-forest-900 dark:text-white group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 leading-relaxed text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardMotion>
                </TransitionLink>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
