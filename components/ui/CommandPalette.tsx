"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  FileText,
  BookOpen,
  CalendarDays,
  CornerDownLeft,
  Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface SearchEntry {
  type: "artikel" | "doa" | "kegiatan";
  title: string;
  subtitle?: string;
  url: string;
  keywords?: string;
}

const STATIC_PAGES: { title: string; subtitle: string; url: string }[] = [
  { title: "Beranda", subtitle: "Halaman utama", url: "/" },
  { title: "Artikel", subtitle: "Daftar artikel & kajian", url: "/artikel" },
  { title: "Tentang Kami", subtitle: "Visi, misi, sejarah JN UKMI", url: "/tentang" },
  { title: "Kabinet", subtitle: "Pengurus periode 2026", url: "/kabinet" },
  { title: "Al-Ma'tsurat", subtitle: "Dzikir pagi & petang", url: "/al-matsurat" },
  { title: "Doa-doa Harian", subtitle: "Kumpulan doa harian", url: "/doa-doa" },
  { title: "Surah Al-Kahfi", subtitle: "Bacaan & terjemahan", url: "/al-kahfi" },
  { title: "Buku UKMI", subtitle: "Layanan perpustakaan bumi", url: "/buku-ukmi" },
  { title: "UKMI Store", subtitle: "Sewa alat & merchandise", url: "/ukmi-store" },
  { title: "Lembaga Dakwah Fakultas", subtitle: "Direktori LDF UNS", url: "/ldf" },
  { title: "OKI", subtitle: "Organisasi Kerohanian Islam", url: "/oki" },
  { title: "Media Partner", subtitle: "Kerjasama & partnership", url: "/partner" },
  { title: "Kontak", subtitle: "Hubungi pengurus", url: "/kontak" },
];

const TYPE_META = {
  artikel: { label: "Artikel", Icon: FileText },
  doa: { label: "Doa", Icon: BookOpen },
  kegiatan: { label: "Kegiatan", Icon: CalendarDays },
} as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Mirror `open` ke ref agar listener keydown (yang diregistrasi sekali)
  // selalu membaca nilai terbaru tanpa side-effect di dalam state updater.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Reset state saat menutup - dipanggil dari event handler (bukan effect).
  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // Buka palette (dari shortcut atau tombol navbar).
  const openPalette = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }, []);

  // Cmd+K / Ctrl+K toggle + event dari tombol navbar.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setActiveIndex(0);
        setOpen(!openRef.current);
      }
      if (e.key === "Escape") closePalette();
    };
    const onOpenEvent = () => openPalette();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("jnukmi:open-search", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("jnukmi:open-search", onOpenEvent);
    };
  }, [closePalette, openPalette]);

  // Fokus input tiap dibuka + fetch index sekali.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    if (!loaded) {
      fetch("/api/search")
        .then((res) => (res.ok ? res.json() : { entries: [] }))
        .then((data) => {
          setEntries(Array.isArray(data.entries) ? data.entries : []);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    }
    return () => clearTimeout(t);
  }, [open, loaded]);

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Lock body & html scroll saat terbuka agar scroll mouse tidak bocor ke background.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pages = STATIC_PAGES.filter(
      (p) => !q || p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)
    ).map((p) => ({ type: "page" as const, ...p }));

    const content = entries
      .filter((e) => {
        if (!q) return true;
        return (
          e.title.toLowerCase().includes(q) ||
          (e.subtitle || "").toLowerCase().includes(q) ||
          (e.keywords || "").toLowerCase().includes(q)
        );
      })
      .slice(0, 30);

    return [...pages, ...content];
  }, [entries, query]);

  // Keyboard navigation & auto-scroll item aktif ke dalam tampilan.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => {
          const next = Math.min(i + 1, results.length - 1);
          itemRefs.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => {
          const prev = Math.max(i - 1, 0);
          itemRefs.current[prev]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          return prev;
        });
      } else if (e.key === "Enter") {
        const item = results[activeIndex];
        if (item) {
          closePalette();
          router.push(item.url);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, activeIndex, router, closePalette]);

  const goTo = useCallback(
    (url: string) => {
      closePalette();
      router.push(url);
    },
    [closePalette, router]
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[10vh] pb-6 bg-black/60 backdrop-blur-sm overflow-hidden"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Pencarian global"
          data-lenis-prevent="true"
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[80vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-forest-600 dark:border-lime overflow-hidden"
            data-lenis-prevent="true"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Cari halaman, artikel, doa, atau kegiatan..."
                className="flex-1 py-4 bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
                aria-label="Kata kunci pencarian"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg">
                ESC
              </kbd>
            </div>

            {/* Results (Isolated scrolling container) */}
            <div
              ref={listRef}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto overscroll-contain p-2 max-h-[55vh]"
              tabIndex={0}
              onWheel={(e) => e.stopPropagation()}
            >
              {results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    Tidak ada hasil untuk &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                results.map((item, index) => {
                  const isPage = item.type === "page";
                  const meta = isPage ? null : TYPE_META[item.type];
                  const Icon = isPage ? Command : meta!.Icon;
                  return (
                    <button
                      key={isPage ? `p-${item.url}` : `c-${item.type}-${item.title}-${index}`}
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      type="button"
                      onClick={() => goTo(item.url)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        index === activeIndex
                          ? "bg-forest-50 dark:bg-forest-950/60"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                      }`}
                    >
                      <span
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          index === activeIndex
                            ? "bg-forest-600 text-white border-forest-600"
                            : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-bold text-gray-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                      {index === activeIndex && (
                        <CornerDownLeft className="w-4 h-4 text-forest-600 dark:text-lime shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0">
              <span>JN UKMI UNS - Cari cepat di seluruh situs</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 border border-gray-200 dark:border-gray-700 rounded">↑↓</kbd>
                navigasi
                <kbd className="px-1.5 py-0.5 border border-gray-200 dark:border-gray-700 rounded ml-1">↵</kbd>
                pilih
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
