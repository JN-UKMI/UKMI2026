"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Compass,
  Target,
  Landmark,
  GraduationCap,
  HandHelping,
  Users,
  Megaphone,
  Trophy,
  Sparkles,
  Globe,
  Star,
  Info,
  History,
  Award,
  ChevronRight,
  Scroll,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";
import aboutData from "@/content/tentang/main.json";

type TabType = "perkenalan" | "sejarah" | "visi" | "misi" | "nilai";

export function TentangTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("perkenalan");
  const [activeTimelineIdx, setActiveTimelineIdx] = useState<number>(0);
  const [timelineDirection, setTimelineDirection] = useState<number>(1); // 1 = down, -1 = up

  const tabItems = [
    { id: "perkenalan" as TabType, label: "Perkenalan", icon: Info },
    { id: "sejarah" as TabType, label: "Sejarah", icon: History },
    { id: "visi" as TabType, label: "Visi", icon: Compass },
    { id: "misi" as TabType, label: "Misi", icon: Target },
    { id: "nilai" as TabType, label: "Nilai", icon: Award },
  ];

  return (
    <>
      {/* Tab Switcher - Styled like a premium control bar */}
      <FadeIn
        direction="up"
        delay={0.1}
        className="flex justify-center mb-12 max-w-full"
      >
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200/60 flex flex-nowrap md:flex-wrap gap-1 max-w-full overflow-x-auto scrollbar-none">
          {tabItems.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center justify-center gap-2 px-3.5 md:px-5 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeAboutTab"
                    className="absolute inset-0 bg-forest-600 rounded-xl shadow-md shadow-forest-600/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <TabIcon
                  className={`relative z-10 w-4 h-4 ${isActive ? "text-white" : "text-gray-400 dark:text-gray-500"}`}
                />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </FadeIn>

      {/* Tab Contents with Framer Motion AnimatePresence */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "perkenalan" && (
            <motion.div
              key="perkenalan"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
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
                    <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase leading-none tracking-wider">
                      Sejak
                    </span>
                    <span className="text-sm font-bold text-forest-800 dark:text-lime leading-none mt-1 font-mono">
                      1991
                    </span>
                  </div>

                  <Image
                    src="/image/logo-jnukmi.svg"
                    alt="Logo JN UKMI"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <p className="mt-8 text-xs md:text-sm text-gray-500 dark:text-gray-400 italic max-w-sm leading-relaxed font-medium">
                  JN UKMI berkomitmen menjadi motor penggerak dakwah kampus yang
                  ramah, akademis, kolaboratif, serta berkarakter kepemimpinan
                  Islam.
                </p>
              </div>

              {/* Right Side: Introduction Card */}
              <div className="lg:col-span-7">
                <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-md p-6 md:p-8 flex flex-col gap-6 transition-colors">
                  {/* Header info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 dark:text-white text-base md:text-lg leading-tight">
                        Lembaga Dakwah Kampus
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                        Universitas Sebelas Maret
                      </p>
                    </div>
                  </div>

                  {/* Description List */}
                  <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {aboutData.deskripsi_perkenalan[0]}
                    </p>
                    <div className="space-y-3.5 pl-1.5">
                      {aboutData.deskripsi_perkenalan.slice(1).map((item, idx) => {
                        const hasSubPoints = item.includes("\n");
                        const [mainText, ...subLines] = hasSubPoints
                          ? item.split("\n")
                          : [item];
                        return (
                          <div key={idx} className="flex gap-3 items-start">
                            <span className="inline-flex items-center justify-center w-5.5 h-5.5 rounded-full bg-forest-100 text-forest-700 font-mono text-[11px] font-black shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div className="flex flex-col gap-2">
                              <p className="font-semibold text-gray-700 dark:text-gray-200 leading-relaxed">
                                {mainText}
                              </p>
                              {hasSubPoints && subLines.length > 0 && (
                                <div className="pl-4 border-l-2 border-lime/40 space-y-1.5 text-xs text-gray-500 dark:text-gray-400 font-bold tracking-wide mt-1">
                                  {subLines
                                    .filter((line) => line.trim() !== "")
                                    .map((line, lIdx) => (
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

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/60">
                      <GraduationCap className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Mentoring Pekanan
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/60">
                      <ShieldCheck className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Ukhuwah Islamiyah
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/60">
                      <Megaphone className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Syiar & Media Kreatif
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/60">
                      <Trophy className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Leadership Program
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/60">
                      <HandHelping className="w-4.5 h-4.5 text-forest-600 shrink-0" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        Bakti Sosial & Rihlah
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: SEJARAH */}
          {activeTab === "sejarah" &&
            (() => {
              const activeMilestone = aboutData.timeline[activeTimelineIdx];
              return (
                <motion.div
                  key="sejarah"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                  {/* Left Side: Sejarah Text Card */}
                  <div className="lg:col-span-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-lg p-6 md:p-8 flex flex-col gap-6 overflow-hidden transition-colors">
                    <div className="self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-400/10 text-forest-700 text-xs font-bold border border-forest-400/20">
                      <History className="w-3.5 h-3.5 text-forest-600" />
                      Sejarah
                    </div>
                    <AnimatePresence mode="wait" custom={timelineDirection}>
                      <motion.div
                        key={activeTimelineIdx}
                        custom={timelineDirection}
                        initial={{ opacity: 0, y: timelineDirection * 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: timelineDirection * -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-col gap-4"
                      >
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white relative pb-3 border-b border-gray-150/60 flex items-center gap-3">
                          Perjalanan JN UKMI
                          <span className="text-forest-600 font-mono">
                            ({activeMilestone.year})
                          </span>
                          <span className="absolute bottom-0 left-0 w-16 h-[3px] bg-lime" />
                        </h3>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                          <h4 className="font-extrabold text-gray-900 dark:text-white text-base md:text-lg flex items-center gap-2 text-forest-800 dark:text-lime">
                            <ChevronRight className="w-5 h-5 text-lime stroke-[3]" />
                            {activeMilestone.title}
                          </h4>
                          <p className="whitespace-pre-line text-justify text-gray-600 dark:text-gray-300 font-medium">
                            {activeMilestone.narrative ||
                              "Detail perjalanan sejarah belum tersedia."}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 border-t border-gray-100 dark:border-gray-800 pt-4 italic">
                            *Klik lingkaran tahun pada linimasa di sebelah
                            kanan untuk menjelajahi periode sejarah lainnya.
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right Side: Timeline Visual Card */}
                  <div className="lg:col-span-6 flex gap-4 md:gap-6 relative pl-2 md:pl-6 w-full">
                    {/* Vertical Line aligned perfectly at the center */}
                    <div className="absolute left-[32px] md:left-[48px] top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-lime overflow-hidden">
                      <div
                        className="absolute w-full h-24 bg-gradient-to-b from-transparent via-forest-650 dark:via-lime to-transparent"
                        style={{
                          animation: "flowDot 4s linear infinite",
                          willChange: "transform",
                        }}
                      />
                    </div>

                    <style>{`
                      @keyframes flowDot {
                        0% { transform: translateY(-100px); }
                        100% { transform: translateY(800px); }
                      }
                    `}</style>

                    <div className="flex flex-col gap-6 w-full">
                      {aboutData.timeline.map((milestone, idx) => {
                        const isSelected = activeTimelineIdx === idx;

                        let IconComponent = (
                          <Sparkles
                            className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                          />
                        );
                        if (milestone.iconType === "landmark") {
                          IconComponent = (
                            <Landmark
                              className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                            />
                          );
                        } else if (milestone.iconType === "scroll") {
                          IconComponent = (
                            <Scroll
                              className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                            />
                          );
                        } else if (milestone.iconType === "users") {
                          IconComponent = (
                            <Users
                              className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                            />
                          );
                        } else if (milestone.iconType === "star") {
                          IconComponent = (
                            <Star
                              className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                            />
                          );
                        } else if (milestone.iconType === "shield") {
                          IconComponent = (
                            <Shield
                              className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                            />
                          );
                        } else if (milestone.iconType === "globe") {
                          IconComponent = (
                            <Globe
                              className={`w-5 h-5 ${isSelected ? "text-white dark:text-forest-950" : "text-forest-600 dark:text-lime"}`}
                            />
                          );
                        }

                        return (
                          <div
                            key={idx}
                            className="flex gap-4 items-start w-full relative"
                          >
                            <button
                              onClick={() => {
                                setTimelineDirection(
                                  idx > activeTimelineIdx ? 1 : -1,
                                );
                                setActiveTimelineIdx(idx);
                              }}
                              className={`relative z-10 w-12 h-12 rounded-full border-2 shadow-sm flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer ${
                                isSelected
                                  ? "border-forest-600 dark:border-lime bg-forest-600 dark:bg-lime text-white dark:text-forest-950 scale-110 ring-4 ring-forest-100 dark:ring-lime/30"
                                  : "border-forest-600 dark:border-lime/80 bg-white dark:bg-gray-900 text-forest-600 dark:text-lime hover:bg-forest-50 dark:hover:bg-gray-800"
                              }`}
                            >
                              {IconComponent}
                            </button>

                            <div
                              onClick={() => {
                                setTimelineDirection(
                                  idx > activeTimelineIdx ? 1 : -1,
                                );
                                setActiveTimelineIdx(idx);
                              }}
                              className={`flex-1 rounded-2xl p-4 flex flex-col gap-2 cursor-pointer border transition-all duration-300 relative ${
                                isSelected
                                  ? "bg-forest-50/70 dark:bg-gray-900 border-forest-300 dark:border-lime shadow-sm"
                                  : "bg-white dark:bg-gray-900/60 border-gray-150 dark:border-gray-800 hover:border-gray-200 dark:hover:border-lime/40 opacity-75 hover:opacity-100"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                {milestone.badge && (
                                  <span
                                    className={`self-start inline-block px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase rounded-md shadow-xs ${
                                      isSelected
                                        ? "bg-forest-600 dark:bg-lime text-white dark:text-forest-950"
                                        : "bg-forest-100 dark:bg-forest-950 text-forest-700 dark:text-lime"
                                    }`}
                                  >
                                    {milestone.badge}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-forest-600 dark:text-lime font-mono">
                                  {milestone.year}
                                </span>
                              </div>
                              <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                {milestone.title || milestone.year}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                                {milestone.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

          {/* TAB 3: VISI */}
          {activeTab === "visi" && (
            <motion.div
              key="visi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-md p-8 text-center flex flex-col items-center gap-6 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center shadow-inner">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-lime tracking-tight">
                Visi Kami
              </h3>
              <blockquote className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed max-w-2xl border-l-4 border-lime px-5 py-3 bg-gray-50/50 dark:bg-gray-800/60 rounded-r-2xl">
                &ldquo;{aboutData.visi}&rdquo;
              </blockquote>
            </motion.div>
          )}

          {/* TAB 4: MISI */}
          {activeTab === "misi" && (
            <motion.div
              key="misi"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-md p-6 md:p-8 transition-colors"
            >
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-150/60 dark:border-gray-800 mb-8 justify-center">
                <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">
                  Misi Kami
                </h3>
              </div>
              <div className="space-y-4">
                {aboutData.misi.map((misiItem, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50 border border-gray-150/60 shadow-xs hover:border-forest-300 transition-all"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-forest-600/10 text-forest-700 font-mono text-xs font-black shrink-0 mt-0.5">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <p className="text-gray-700 dark:text-gray-200 text-sm md:text-base leading-relaxed font-semibold">
                      {misiItem}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: NILAI */}
          {activeTab === "nilai" && (
            <motion.div
              key="nilai"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/60 dark:border-gray-800 shadow-md p-6 md:p-8 transition-colors"
            >
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-150/60 dark:border-gray-800 mb-8 justify-center">
                <div className="w-10 h-10 rounded-xl bg-forest-600 text-white flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">
                  Nilai-Nilai Luhur Organisasi
                </h3>
              </div>

              <div className="space-y-4">
                {aboutData.nilai.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-150/60 dark:border-gray-700 shadow-xs hover:border-forest-300 dark:hover:border-lime transition-all"
                  >
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-forest-600/10 text-forest-700 font-mono text-xs font-black shrink-0 mt-0.5">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-base font-extrabold text-forest-900 dark:text-lime">
                        {point.title}
                      </h4>
                      <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-semibold">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
