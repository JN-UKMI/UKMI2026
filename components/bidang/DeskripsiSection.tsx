"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";
import type { TentangCard } from "@/lib/types";
import {
  Target,
  Users,
  BookOpen,
  Calendar,
  Globe,
  Megaphone,
  Palette,
  Camera,
  DollarSign,
  TrendingUp,
  Store,
  Heart,
  FileText,
  Award,
  Star,
  Clipboard,
  Settings,
  Shield,
  Compass,
  Info,
  type LucideIcon,
} from "lucide-react";

interface DeskripsiSectionProps {
  deskripsi: string;
  tentangCards?: TentangCard[];
}

// Map icon names from JSON to Lucide components
const iconMap: Record<string, LucideIcon> = {
  target: Target,
  users: Users,
  bookopen: BookOpen,
  calendar: Calendar,
  globe: Globe,
  megaphone: Megaphone,
  palette: Palette,
  camera: Camera,
  dollarsign: DollarSign,
  trendingup: TrendingUp,
  store: Store,
  heart: Heart,
  filetext: FileText,
  award: Award,
  star: Star,
  clipboard: Clipboard,
  settings: Settings,
  shield: Shield,
  compass: Compass,
  info: Info,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name.toLowerCase()] || Info;
}

export function DeskripsiSection({ deskripsi, tentangCards }: DeskripsiSectionProps) {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      {/* Summary Card */}
      <FadeIn>
        <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-lg p-8 md:p-10 mb-14 overflow-hidden transition-colors group">
          {/* Decorative gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-forest-600 via-lime to-emerald-500" />

          {/* Subtle background pattern */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-forest-600/5 dark:bg-lime/5 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-forest-600/10 dark:bg-lime/10">
                <Info className="w-5 h-5 text-forest-600 dark:text-lime" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                Tentang Bidang
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base md:text-lg">
              {deskripsi}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Highlight Cards Grid */}
      {tentangCards && tentangCards.length > 0 && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 overflow-visible">
          {tentangCards.map((card, i) => {
            const Icon = getIcon(card.icon);
            return (
              <StaggerItem key={i}>
                <div className="group/card h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/60 dark:border-gray-800 shadow-sm hover:shadow-xl dark:hover:shadow-[0_0_25px_rgba(73,154,19,0.15)] p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-forest-600/30 dark:hover:border-lime/30 flex flex-col gap-4">
                  {/* Icon circle */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-forest-600/10 dark:bg-lime/10 group-hover/card:bg-forest-600/15 dark:group-hover/card:bg-lime/20 transition-colors shrink-0">
                    <Icon className="w-6 h-6 text-forest-600 dark:text-lime" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-base md:text-lg text-gray-900 dark:text-white group-hover/card:text-forest-600 dark:group-hover/card:text-lime transition-colors leading-snug">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}
    </section>
  );
}
