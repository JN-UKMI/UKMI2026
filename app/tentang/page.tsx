"use client";

import { useState } from "react";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import aboutData from "@/content/tentang/main.json";
import { 
  ShieldCheck, 
  Compass, 
  Target, 
  Landmark, 
  Milestone, 
  GraduationCap, 
  HandHelping, 
  Users, 
  Megaphone, 
  Trophy, 
  Sparkles, 
  Globe, 
  Star, 
  Heart,
  Info,
  History,
  Award,
  ChevronRight,
  Scroll,
  Shield
} from "lucide-react";

type TabType = "perkenalan" | "sejarah" | "visi" | "misi" | "nilai";

export default function TentangPage() {
  const [activeTab, setActiveTab] = useState<TabType>("perkenalan");
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number>(0);

  const tabItems = [
    { id: "perkenalan" as TabType, label: "Perkenalan", icon: Info },
    { id: "sejarah" as TabType, label: "Sejarah", icon: History },
    { id: "visi" as TabType, label: "Visi", icon: Compass },
    { id: "misi" as TabType, label: "Misi", icon: Target },
    { id: "nilai" as TabType, label: "Nilai", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <PageHero 
        badge="Jamaah Nurul Huda UNS"
        title="Tentang Kami" 
        subtitle="Visi, Misi, Tujuan, dan Sejarah Perjalanan Dakwah JN UKMI" 
      />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Top Header Title & Subtitle (Centered Layout) */}
        <div className="flex flex-col items-center justify-center text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            JN UKMI <span className="text-forest-600 relative inline-block">
              Universitas Sebelas Maret
              <span className="absolute bottom-1 left-0 w-full h-[4px] bg-lime/30 rounded-full" />
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-500 font-medium max-w-2xl">
            Mengenal lebih dalam profil, arah gerak, sejarah, dan nilai-nilai perjuangan unit kegiatan mahasiswa Islam tingkat universitas.
          </p>
        </div>

        {/* Tab Switcher - Styled like a premium control bar */}
        <div className="flex justify-center mb-12 max-w-full">
          <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200/60 flex flex-nowrap md:flex-wrap gap-1 max-w-full overflow-x-auto scrollbar-none">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-3.5 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-forest-600 text-white shadow-md shadow-forest-600/10"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Contents with Fluid CSS Animations */}
        <div className="transition-all duration-300">
          {/* TAB 1: PERKENALAN */}
          {activeTab === "perkenalan" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-[fadeIn_0.5s_ease-out]">
              {/* Left Side: Logo & Badges */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-200/50 p-8">
                  {/* Refined 1px Refraction Border Badges */}
                  <span className="absolute -top-3 -left-3 bg-forest-600 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Dakwah
                  </span>
                  <span className="absolute -bottom-3 -left-3 bg-forest-600 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full shadow-sm flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Ukhuwah
                  </span>
                  <div className="absolute -bottom-4 -right-3 bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-2 flex flex-col items-center">
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none tracking-wider">Sejak</span>
                    <span className="text-sm font-bold text-forest-800 leading-none mt-1 font-mono">1991</span>
                  </div>

                  <Image
                    src="/image/logo-jnukmi.svg"
                    alt="Logo JN UKMI"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <p className="mt-8 text-xs md:text-sm text-gray-500 italic max-w-sm leading-relaxed font-medium">
                  JN UKMI berkomitmen menjadi motor penggerak dakwah kampus yang ramah, akademis, kolaboratif, serta berkarakter kepemimpinan Islam.
                </p>
              </div>

              {/* Right Side: Introduction Card */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl border border-gray-200/60 shadow-md p-6 md:p-8 flex flex-col gap-6">
                  {/* Header info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-base md:text-lg leading-tight">
                        Lembaga Dakwah Kampus
                      </h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">Universitas Sebelas Maret</p>
                    </div>
                  </div>

                  {/* Description List */}
                  <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                    <p className="font-semibold text-gray-800">
                      {aboutData.deskripsi_perkenalan[0]}
                    </p>
                    <div className="space-y-3.5 pl-1.5">
                      {aboutData.deskripsi_perkenalan.slice(1).map((item, idx) => {
                        const hasSubPoints = item.includes("\n");
                        const [mainText, ...subLines] = hasSubPoints ? item.split("\n") : [item];
                        return (
                          <div key={idx} className="flex gap-3 items-start">
                            <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-forest-100 text-forest-700 font-mono text-[11px] font-black shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex flex-col gap-2">
                              <p className="font-semibold text-gray-700 leading-relaxed">
                                {mainText}
                              </p>
                              {hasSubPoints && subLines.length > 0 && (
                                <div className="pl-4 border-l-2 border-lime/40 space-y-1.5 text-xs text-gray-500 font-bold tracking-wide mt-1">
                                  {subLines.filter(line => line.trim() !== "").map((line, lIdx) => (
                                    <p key={lIdx}>{line}</p>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Highlights Grid with custom borders (anti-card overuse) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/50">
                      <GraduationCap className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">Mentoring Pekanan</span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/50">
                      <Users className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">Kajian Keislaman</span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/50">
                      <ShieldCheck className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">Ukhuwah Islamiyah</span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/50">
                      <Megaphone className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">Syiar & Media Kreatif</span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/50">
                      <Trophy className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">Leadership Program</span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] border border-gray-200/50">
                      <HandHelping className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700">Bakti Sosial & Rihlah</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEJARAH */}
          {activeTab === "sejarah" && (() => {
            const activeMilestone = aboutData.timeline[activeTimelineIdx];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-[fadeIn_0.5s_ease-out]">
                {/* Left Side: Sejarah Text Card */}
                <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200/60 shadow-lg p-6 md:p-8 flex flex-col gap-6">
                  <div className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-400/10 text-forest-700 text-xs font-bold border border-forest-400/20">
                    <History className="w-3.5 h-3.5 text-forest-600" />
                    Sejarah
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 relative pb-3 border-b border-gray-150/60 flex items-center gap-3">
                    Perjalanan JN UKMI
                    <span className="text-forest-600 font-mono">({activeMilestone.year})</span>
                    <span className="absolute bottom-0 left-0 w-16 h-[3px] bg-lime" />
                  </h3>
                  <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed">
                    <h4 className="font-extrabold text-gray-900 text-base md:text-lg flex items-center gap-2 text-forest-800">
                      <ChevronRight className="w-5 h-5 text-lime stroke-[3]" />
                      {activeMilestone.title}
                    </h4>
                    <p className="whitespace-pre-line text-gray-600 font-medium">
                      {activeMilestone.narrative || "Detail perjalanan sejarah belum tersedia."}
                    </p>
                    <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-4 italic">
                      *Klik lingkaran tahun pada linimasa di sebelah kanan untuk menjelajahi periode sejarah lainnya.
                    </p>
                  </div>
                </div>

                {/* Right Side: Timeline Visual Card */}
                <div className="lg:col-span-6 flex gap-4 md:gap-6 relative pl-2 md:pl-6 w-full">
                  {/* Vertical Line aligned perfectly at the center (pl-2 = 8px + icon center) */}
                  <div className="absolute left-[32px] md:left-[48px] top-6 bottom-6 w-0.5 bg-gray-200 overflow-hidden">
                    {/* Glowing flow dot passing along the line */}
                    <div 
                      className="absolute w-full h-24 bg-gradient-to-b from-transparent via-forest-650 to-transparent" 
                      style={{ 
                        animation: "flowDot 4s linear infinite",
                        willChange: "transform"
                      }} 
                    />
                  </div>

                  {/* Inline keyframe style for the timeline flow effect */}
                  <style>{`
                    @keyframes flowDot {
                      0% { transform: translateY(-100px); }
                      100% { transform: translateY(800px); }
                    }
                  `}</style>

                  <div className="flex flex-col gap-6 w-full">
                    {aboutData.timeline.map((milestone, idx) => {
                      const isSelected = activeTimelineIdx === idx;

                      // Map iconType to Lucide icons
                      let IconComponent = <Sparkles className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      if (milestone.iconType === "landmark") {
                        IconComponent = <Landmark className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      } else if (milestone.iconType === "scroll") {
                        IconComponent = <Scroll className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      } else if (milestone.iconType === "users") {
                        IconComponent = <Users className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      } else if (milestone.iconType === "star") {
                        IconComponent = <Star className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      } else if (milestone.iconType === "shield") {
                        IconComponent = <Shield className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      } else if (milestone.iconType === "globe") {
                        IconComponent = <Globe className={`w-5 h-5 ${isSelected ? "text-white" : "text-forest-600"}`} />;
                      }

                      return (
                        <div key={idx} className="flex gap-4 items-start w-full relative">
                          {/* Timeline Icon Node as Button */}
                          <button
                            onClick={() => setActiveTimelineIdx(idx)}
                            className={`relative z-10 w-12 h-12 rounded-full border-2 shadow-sm flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer ${
                              isSelected
                                ? "border-forest-600 bg-forest-600 text-white scale-110 ring-4 ring-forest-100"
                                : "border-forest-600 bg-white text-forest-600 hover:bg-forest-50"
                            }`}
                          >
                            {IconComponent}
                          </button>

                          {/* Timeline Card */}
                          <div
                            onClick={() => setActiveTimelineIdx(idx)}
                            className={`flex-1 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer border transition-all duration-300 relative ${
                              isSelected
                                ? "bg-forest-50/70 border-forest-300 shadow-sm"
                                : "bg-white border-gray-150 hover:border-gray-200 opacity-75 hover:opacity-100"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              {milestone.badge && (
                                <span className={`self-start inline-block px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase rounded-md shadow-xs ${
                                  isSelected ? "bg-forest-600 text-white" : "bg-forest-100 text-forest-700"
                                }`}>
                                  {milestone.badge}
                                </span>
                              )}
                              <span className="text-xs font-bold text-forest-600 font-mono">
                                {milestone.year}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm">
                              {milestone.title || milestone.year}
                            </h4>
                            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 3: VISI */}
          {activeTab === "visi" && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-md p-8 text-center flex flex-col items-center gap-6 animate-[fadeIn_0.5s_ease-out] transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center shadow-inner">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-lime tracking-tight">Visi Kami</h3>
              <blockquote className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl border-l-4 border-lime px-5 py-3 bg-gray-50/50 dark:bg-gray-800/60 rounded-r-2xl">
                &ldquo;{aboutData.visi}&rdquo;
              </blockquote>
            </div>
          )}

          {/* TAB 4: MISI */}
          {activeTab === "misi" && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200/60 shadow-md p-6 md:p-8 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-150/60 mb-8 justify-center">
                <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">Misi Kami</h3>
              </div>
              <div className="space-y-4">
                {aboutData.misi.map((misiItem, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50 border border-gray-150/60 shadow-xs hover:border-forest-300 transition-all">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-forest-600/10 text-forest-700 font-mono text-xs font-black shrink-0 mt-0.5">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed font-semibold">
                      {misiItem}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NILAI */}
          {activeTab === "nilai" && (
            <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200/60 shadow-md p-6 md:p-8 animate-[fadeIn_0.5s_ease-out]">
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-150/60 mb-8">
                <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">Nilai-Nilai Luhur Organisasi</h3>
              </div>

              {/* Numbered Nilai list with accent rules */}
              <div className="space-y-6">
                {aboutData.nilai.map((point, idx) => (
                  <div key={idx} className="flex gap-5 items-start border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                    <span className="text-xl md:text-2xl font-extrabold text-forest-600/30 font-mono shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1 pt-1">
                      <h4 className="text-base font-extrabold text-forest-900">
                        {point.title}
                      </h4>
                      <p className="text-sm text-gray-600 font-semibold leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}