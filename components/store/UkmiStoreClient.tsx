"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SlideIn } from "@/components/ui/SlideIn";
import { UkmiStoreContent, UkmiStoreItem } from "@/lib/types";
import {
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  FileText,
  Package,
  Droplets,
  Zap,
  Tent,
  Fan,
  Image as ImageIcon,
  Scissors,
  Disc,
  Clock,
  CheckCircle2,
  ListOrdered,
  BookOpenCheck,
  UserCheck,
  Plus,
  Check,
  Trash2,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Package: <Package className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Tent: <Tent className="w-6 h-6" />,
  Fan: <Fan className="w-6 h-6" />,
  Image: <ImageIcon className="w-6 h-6" />,
  Scissors: <Scissors className="w-6 h-6" />,
  Disc: <Disc className="w-6 h-6" />,
};

interface UkmiStoreClientProps {
  data: UkmiStoreContent;
}

export function UkmiStoreClient({ data }: UkmiStoreClientProps) {
  const [selectedItems, setSelectedItems] = useState<UkmiStoreItem[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const toggleSelectItem = (item: UkmiStoreItem) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.name === item.name);
      if (exists) {
        return prev.filter((i) => i.name !== item.name);
      } else {
        return [...prev, item];
      }
    });
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const generateWaUrl = (contactPhone: string, contactName: string) => {
    const phoneClean = contactPhone.replace(/[^0-9]/g, "");
    if (selectedItems.length === 0) {
      const text = encodeURIComponent(`Halo ${contactName}, saya ingin bertanya mengenai sewa alat di UKMI Store.`);
      return `https://wa.me/${phoneClean}?text=${text}`;
    }

    const itemListText = selectedItems
      .map((item) => `• ${item.name} (${item.price_detail})`)
      .join("\n");

    const fullMessage = `Halo ${contactName}, saya ingin menyewa perlengkapan berikut dari UKMI Store:\n\n${itemListText}\n\nMohon info ketersediaan stok & jadwal pengambilannya. Terima kasih!`;
    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(fullMessage)}`;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-12 flex flex-col gap-16">
      {/* Banner Guideline & Quick Info */}
      <SlideIn direction="left">
      <section className="bg-gradient-to-br from-forest-900 via-forest-800 to-black text-white rounded-3xl p-8 sm:p-10 border-2 border-lime/70 dark:border-lime shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              {data.tagline}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Pilih perlengkapan yang kamu butuhkan dengan menekan tombol <strong>+ Pilih</strong>. Setelah selesai memilih, hubungi Contact Person di bagian bawah untuk pemesanan otomatis!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href={data.guideline_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-lime hover:bg-lime/90 text-forest-950 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Guideline Sewa (PDF) <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
      </SlideIn>

      {/* 1. KATALOG ALAT SEWA */}
      <SlideIn direction="right">
      <section>
        <div className="relative mb-6">
          <SectionHeader
            icon={<ShoppingBag className="w-6 h-6" />}
            title="Daftar Sewa Alat"
            subtitle="Klik untuk memilih alat yang ingin kamu sewa (bisa pilih lebih dari satu)"
          />

          {selectedItems.length > 0 && (
            <div className="flex justify-center sm:justify-end -mt-6 mb-6">
              <button
                type="button"
                onClick={clearSelection}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900/80 text-red-700 dark:text-red-300 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset Pilihan ({selectedItems.length})
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {data.items.map((item, index) => {
            const isSelected = selectedItems.some((i) => i.name === item.name);
            const iconElement = iconMap[item.icon] || <Package className="w-5 h-5 sm:w-6 sm:h-6" />;

            return (
              <motion.div
                key={index}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${isSelected ? "Batalkan pilihan" : "Pilih"} ${item.name}`}
                onClick={() => toggleSelectItem(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleSelectItem(item);
                  }
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -5 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className={`group cursor-pointer rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border transition-all duration-300 flex flex-col justify-between relative ${
                  isSelected
                    ? "bg-forest-50/60 dark:bg-forest-950/50 border-lime dark:border-lime ring-2 ring-forest-600/30 dark:ring-lime/30 shadow-md"
                    : "bg-white dark:bg-gray-900 border-2 border-forest-600 dark:border-lime shadow-sm hover:shadow-xl"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-0.5 sm:mb-2">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                        isSelected
                          ? "bg-forest-600 text-white dark:bg-forest-800 dark:text-lime border border-forest-600 dark:border-lime shadow-sm"
                          : "bg-lime/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime"
                      }`}
                    >
                      {iconElement}
                    </div>

                    <h3 className="card-title-underline text-sm sm:text-lg font-bold text-forest-900 dark:text-white leading-snug group-hover:text-forest-600 dark:group-hover:text-lime transition-colors line-clamp-2">
                      {item.name}
                    </h3>

                    {isSelected && (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-forest-600 text-white dark:bg-forest-800 dark:text-lime border border-forest-600 dark:border-lime shadow-xs shrink-0 ml-auto">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> <span className="hidden sm:inline">Terpilih</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-1 sm:mt-2 mb-3 sm:mb-6">
                    <span className="text-lg sm:text-2xl font-black text-forest-700 dark:text-lime tracking-tight">
                      {item.price}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-1 block sm:inline">
                      / {item.unit}
                    </span>
                  </div>
                </div>

                <motion.div
                  aria-hidden="true"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                  className={`inline-flex items-center justify-center gap-1.5 w-full py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs ${
                    isSelected
                      ? "bg-forest-600 text-white dark:bg-forest-800 dark:text-lime border border-forest-600 dark:border-lime shadow-sm"
                      : "bg-forest-50 text-forest-800 border border-forest-200 group-hover:bg-forest-600 group-hover:text-white group-hover:border-forest-600 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:group-hover:bg-forest-800 dark:group-hover:text-lime dark:group-hover:border-lime"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Terpilih</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Pilih</span>
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>
      </SlideIn>

      {/* 2. GUIDELINE RESMI JN UKMI RENT */}
      {data.guideline && (
        <>
          <SlideIn direction="left">
            <SectionHeader
              icon={<BookOpenCheck className="w-6 h-6" />}
              title={data.guideline.title}
              subtitle={data.guideline.description}
            />
          </SlideIn>

          {/* Card 1: Ketentuan & Durasi Peminjaman */}
          <SlideIn direction="left">
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border-2 border-forest-600 dark:border-lime shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-forest-600 dark:text-lime" />
                <h3 className="text-lg font-black text-forest-900 dark:text-white">1. Ketentuan & Durasi Peminjaman</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.guideline.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-lime/10 dark:bg-forest-900/60 text-forest-700 dark:text-lime rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 border border-lime/20 dark:border-forest-800">
                        {rule.title}
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {rule.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </SlideIn>

          {/* Card 2: Alur & Prosedur Penyewaan */}
          <SlideIn direction="right">
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border-2 border-forest-600 dark:border-lime shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-5">
                <ListOrdered className="w-5 h-5 text-forest-600 dark:text-lime" />
                <h3 className="text-lg font-black text-forest-900 dark:text-white">2. Alur & Prosedur Penyewaan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.guideline.procedures.map((proc, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-xl bg-lime/10 dark:bg-forest-900/60 text-forest-700 dark:text-lime flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-forest-900 dark:text-white mb-1">
                        {proc.step.replace(/^[0-9]+\.\s*/, "")}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {proc.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </SlideIn>

          {/* Card 3: Contact Person */}
          <SlideIn direction="left">
            <section className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border-2 border-forest-600 dark:border-lime shadow-sm transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-forest-600 dark:text-lime" />
                <h3 className="text-lg font-black text-forest-900 dark:text-white">3. Contact Person (Pemesanan via WA)</h3>
              </div>

              {selectedItems.length > 0 ? (
                <div className="bg-forest-50 dark:bg-forest-950/60 border border-forest-200 dark:border-forest-800 rounded-2xl p-4 mb-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-forest-800 dark:text-lime flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4" /> Daftar Barang Yang Kamu Pilih ({selectedItems.length}):
                    </span>
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Batal Pilih Semua
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedItems.map((item) => (
                      <span
                        key={item.name}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white dark:bg-gray-800 text-forest-900 dark:text-gray-100 rounded-full text-xs font-semibold shadow-xs border border-forest-200 dark:border-gray-700"
                      >
                        {item.name} ({item.price})
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectItem(item);
                          }}
                          className="ml-1 text-gray-400 hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
                  💡 <em>Tips: Pilih barang di atas terlebih dahulu. Saat kamu klik CP di bawah, pesananmu akan langsung terisi secara otomatis!</em>
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.contacts.map((contact, index) => {
                  const waUrl = generateWaUrl(contact.phone, contact.name);

                  return (
                    <a
                      key={index}
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-5 bg-forest-600 text-white dark:bg-forest-900/90 dark:text-white border-2 border-forest-600 dark:border-lime hover:border-lime dark:hover:border-lime hover:bg-forest-800 dark:hover:bg-forest-800/90 rounded-2xl flex items-center justify-between transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer active:scale-95"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/40 dark:border-lime/60 bg-white/10 shadow-xs">
                          {contact.avatar ? (
                            <Image
                              src={contact.avatar}
                              alt={`Foto ${contact.name}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-xs uppercase text-white dark:text-lime">
                              {contact.role || contact.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 dark:bg-lime/20 text-white dark:text-lime border border-transparent dark:border-lime/30">
                              {contact.role || "Narahubung"}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white dark:text-lime transition-colors mt-0.5">
                            {contact.name}
                          </h4>
                          <p className="text-xs text-white/90 dark:text-gray-200 font-medium">
                            {contact.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 dark:bg-lime/20 text-white dark:text-lime border border-transparent dark:border-lime/30 font-bold text-xs shrink-0">
                        <MessageCircle className="w-4 h-4" />
                        <span>Kirim WA</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          </SlideIn>
        </>
      )}

      {/* Floating Bottom Bar when items are selected */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-forest-900/95 dark:bg-gray-900/95 backdrop-blur-md text-white p-4 rounded-3xl border border-lime/40 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-lime font-bold uppercase tracking-wider">
                {selectedItems.length} Barang Terpilih
              </span>
              <span className="text-xs text-gray-200 line-clamp-1 max-w-[200px] sm:max-w-xs">
                {selectedItems.map((i) => i.name).join(", ")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={generateWaUrl(data.contacts[0].phone, data.contacts[0].name)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-lime text-forest-950 hover:bg-lime/90 rounded-2xl font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Kirim ke CP
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
