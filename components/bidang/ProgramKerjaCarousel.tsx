"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Target, Shield } from "lucide-react";

interface ProgramKerjaCarouselProps {
  program_kerja: Array<{ title: string; description: string }>;
}

export function ProgramKerjaCarousel({ program_kerja }: ProgramKerjaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);

  // If loaded program_kerja has less than 10 items, pad it with realistic dummy ones
  let itemsToShow = [...(program_kerja || [])];
  if (itemsToShow.length > 0 && itemsToShow.length < 10) {
    const dummyTitles = [
      "Kajian Intensif Kontemporer",
      "Pemberdayaan Ekonomi Kreatif",
      "Sosialisasi Dakwah Inklusif",
      "Rihlah & Refreshing Pengurus",
      "Pelatihan Jurnalistik Kampus",
      "Bakti Sosial Masyarakat Desa",
      "Pekan Olahraga & Seni Akhwat",
      "Konsolidasi LDF se-UNS",
      "Tebar Qur'an Pelosok Daerah",
      "Talkshow Inspiratif Pemuda Muslim"
    ];
    const dummyDescs = [
      "Mengadakan seminar dan diskusi interaktif mengenai tantangan moral dan pemikiran pemuda Muslim di era disrupsi digital saat ini.",
      "Mengembangkan inkubator bisnis mandiri untuk membantu kemandirian finansial anggota dan pembiayaan dakwah kreatif.",
      "Kampanye ramah keberagaman untuk menyebarkan nilai-nilai Islam rahmatan lil 'alamin secara santun di lingkungan fakultas.",
      "Kegiatan rekreasi dan bonding luar ruangan untuk mempererat tali ukhuwah dan menjaga kebugaran spiritual para pengurus kabinet.",
      "Workshop penulisan artikel, opini, dan teknik wawancara berita keislaman untuk mencetak kader penulis dakwah yang kritis.",
      "Penyaluran bantuan logistik, pemeriksaan kesehatan gratis, dan mengajar anak-anak mengaji di daerah terpencil binaan JN UKMI.",
      "Kompetisi olahraga panahan, bulutangkis, serta lomba kaligrafi seni dekorasi khusus akhwat untuk menyalurkan bakat minat positif.",
      "Temu koordinasi triwulan seluruh pengurus Lembaga Dakwah Fakultas di lingkungan UNS guna menyelaraskan gerak syiar dakwah.",
      "Program pengumpulan dan distribusi mushaf Al-Qur'an layak baca ke masjid-masjid dan TPQ yang membutuhkan di wilayah pelosok.",
      "Diskusi panel menghadirkan tokoh muda nasional berprestasi untuk memotivasi mahasiswa Muslim agar berprestasi dan kontributif."
    ];

    const needed = 10 - itemsToShow.length;
    for (let k = 0; k < needed; k++) {
      itemsToShow.push({
        title: dummyTitles[k % dummyTitles.length],
        description: dummyDescs[k % dummyDescs.length]
      });
    }
  }

  // Update visible cards based on screen size safely after mounting
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  if (itemsToShow.length === 0) return null;

  const maxIndex = Math.max(0, itemsToShow.length - visibleCards);

  // Navigation handlers with boundary locking
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Helper mock details for card enrichment
  const getEnrichedDetails = (index: number) => {
    const targets = ["Triwulan I", "Bulanan", "Setiap Semester", "Kondisional", "Pekanan"];
    const indicators = ["Terlaksana 100%", "Min. 50 Peserta", "Konten Konsisten", "Sinergi LDF Aktif", "Rilis Tepat Waktu"];
    
    return {
      target: targets[index % targets.length],
      indicator: indicators[index % indicators.length]
    };
  };

  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-5xl mx-auto relative">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-forest-900 mb-12 text-center relative inline-block left-1/2 -translate-x-1/2 uppercase tracking-wider">
          Program Kerja Unggulan
          <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-16 h-[3px] bg-lime rounded-full" />
        </h2>

        {/* Carousel Container */}
        <div className="relative px-2 sm:px-12 w-full overflow-hidden">
          {/* Slider viewport */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(calc(-${currentIndex * (100 / visibleCards)}% - ${currentIndex * (24 / visibleCards)}px))` }}
            >
              {itemsToShow.map((prog, i) => {
                const info = getEnrichedDetails(i);
                return (
                  <div
                    key={i}
                    className="w-full shrink-0 md:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-200/50 flex flex-col justify-between h-[360px]"
                  >
                    <div>
                      {/* Top Bar: Number & Icon */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 bg-forest-600/10 text-forest-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <span className="text-[10px] font-black text-forest-600/35 uppercase tracking-widest">
                          Proker
                        </span>
                      </div>

                      <h3 className="font-extrabold text-gray-900 text-base md:text-lg mb-3 tracking-tight leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-6 font-medium line-clamp-4">
                        {prog.description}
                      </p>
                    </div>

                    {/* Rich Metadata Info Panel at Bottom */}
                    <div className="space-y-2.5 pt-4 border-t border-gray-100/80 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-forest-600 shrink-0" />
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider shrink-0 w-20">Target:</span>
                        <span className="text-gray-700">{info.target}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-forest-600 shrink-0" />
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider shrink-0 w-20">Indikator:</span>
                        <span className="text-gray-700">{info.indicator}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-forest-600 shrink-0" />
                        <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider shrink-0 w-20">Status:</span>
                        <span className="text-forest-600 font-bold">Terjadwal</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons (Vertically centered on the left and right sides) */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-150 flex items-center justify-center transition-all duration-200 ${
              currentIndex === 0
                ? "opacity-40 cursor-not-allowed text-gray-300"
                : "opacity-100 cursor-pointer text-gray-700 hover:scale-105 active:scale-95"
            }`}
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-150 flex items-center justify-center transition-all duration-200 ${
              currentIndex >= maxIndex
                ? "opacity-40 cursor-not-allowed text-gray-300"
                : "opacity-100 cursor-pointer text-gray-700 hover:scale-105 active:scale-95"
            }`}
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Indicator dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === i ? "bg-forest-600 w-6" : "bg-gray-250"
              }`}
              aria-label={`Slide ke-${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
