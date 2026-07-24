import { loadEvents } from "@/lib/content";
import { KalenderInteractive } from "./KalenderInteractive";
import { Calendar } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

export async function KalenderSection() {
  const { events, monthly_quotes, hijri_months } = await loadEvents();

  return (
    <section className="relative overflow-hidden py-20 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* ── Animated Background Bubbles & Decorative Orbs ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glowing Ambient Gradient Orbs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-forest-600/10 dark:bg-lime/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full bg-forest-400/10 dark:bg-forest-600/15 blur-3xl animate-pulse [animation-delay:4s]" />

        {/* Floating Bubble Circles */}
        <div className="absolute top-12 left-10 w-44 h-44 rounded-full border border-forest-600/10 dark:border-lime/15 bg-gradient-to-tr from-forest-600/5 to-transparent animate-bounce [animation-duration:8s]" />
        <div className="absolute top-1/3 right-16 w-64 h-64 rounded-full border border-emerald-500/10 dark:border-emerald-400/15 bg-gradient-to-br from-emerald-500/5 to-transparent animate-bounce [animation-duration:12s] [animation-delay:1s]" />
        <div className="absolute bottom-20 left-1/4 w-36 h-36 rounded-full border border-forest-400/15 dark:border-lime/10 bg-gradient-to-bl from-forest-400/5 to-transparent animate-bounce [animation-duration:10s] [animation-delay:3s]" />
        <div className="absolute bottom-12 right-1/3 w-52 h-52 rounded-full border border-forest-600/10 dark:border-lime/10 bg-gradient-to-tr from-lime/5 to-transparent animate-bounce [animation-duration:14s] [animation-delay:2s]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeader
          icon={<Calendar className="w-6 h-6" />}
          title="Kalender UKMI & Puasa Sunnah"
          subtitle="Jadwal kegiatan kepengurusan JN UKMI dan kalender puasa sunnah bulanan"
        />

        <KalenderInteractive
          events={events}
          monthlyQuotes={monthly_quotes}
          hijriMonths={hijri_months}
        />
      </div>
    </section>
  );
}
