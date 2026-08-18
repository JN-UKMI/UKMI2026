"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Music,
  Compass,
  Heart,
  Sprout,
  Sun,
  Share2,
  Check,
  Sparkles,
  MessageSquareHeart,
  PenLine,
  Send,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface TitipanSemangatItem {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const POPUP_LAST_SEEN_KEY = "ukmi_welcome_popup_last_seen_ts";
const POPUP_DISMISS_UNTIL_KEY = "ukmi_welcome_popup_dismiss_until_ts";

const COOLDOWN_10_MIN_MS = 10 * 60 * 1000; // 10 menit (600.000 ms)
const DISMISS_1_DAY_MS = 24 * 60 * 60 * 1000; // 1 hari (86.400.000 ms)

// In-memory tracker across client-side page transitions (SPA navigation)
let hasShownInSessionMemory = false;

function formatMessageDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

export function WelcomeModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Titipan Semangat State
  const [messages, setMessages] = useState<TitipanSemangatItem[]>([]);
  const [name, setName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load messages on mount (maksimal 10 pesan terbaru)
  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch("/api/titipan-semangat?limit=10");
        if (res.ok) {
          const data = await res.json();
          if (data.ok && Array.isArray(data.messages)) {
            setMessages(data.messages.slice(0, 10));
          }
        }
      } catch (err) {
        console.warn("Gagal memuat titipan semangat:", err);
      }
    }
    loadMessages();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate check on mount
    setMounted(true);

    // 1. Jika sudah pernah muncul dalam sesi navigasi ini (berpindah antar halaman), jangan tampilkan lagi
    if (hasShownInSessionMemory) {
      return;
    }

    try {
      const now = Date.now();

      // 2. Cek apakah user memilih "Jangan tampilkan hari ini" (jeda 1 hari / 24 jam)
      const dismissUntilStr = localStorage.getItem(POPUP_DISMISS_UNTIL_KEY);
      if (dismissUntilStr) {
        const dismissUntil = parseInt(dismissUntilStr, 10);
        if (!Number.isNaN(dismissUntil) && now < dismissUntil) {
          // Masih dalam masa penundaan 1 hari
          return;
        }
      }

      // 3. Cek timer lokal 10 menit
      const lastSeenStr = localStorage.getItem(POPUP_LAST_SEEN_KEY);
      if (lastSeenStr) {
        const lastSeen = parseInt(lastSeenStr, 10);
        if (!Number.isNaN(lastSeen) && now - lastSeen < COOLDOWN_10_MIN_MS) {
          // Masih dalam masa jeda 10 menit
          return;
        }
      }

      // Tandai sudah muncul untuk sesi ini dan catat timestamp sekarang
      hasShownInSessionMemory = true;
      localStorage.setItem(POPUP_LAST_SEEN_KEY, String(now));

      // Tampilkan popup dengan delay singkat untuk transisi halus
      timerRef.current = setTimeout(() => {
        setIsOpen(true);
      }, 450);
    } catch {
      // Fallback jika localStorage tidak dapat diakses
      if (!hasShownInSessionMemory) {
        hasShownInSessionMemory = true;
        timerRef.current = setTimeout(() => {
          setIsOpen(true);
        }, 450);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Lock background body scroll when popup is active
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(POPUP_LAST_SEEN_KEY, String(Date.now()));
    } catch {
      // Ignore
    }
  };

  const handleDismiss1Day = () => {
    try {
      const now = Date.now();
      localStorage.setItem(POPUP_DISMISS_UNTIL_KEY, String(now + DISMISS_1_DAY_MS));
      localStorage.setItem(POPUP_LAST_SEEN_KEY, String(now));
    } catch {
      // Ignore
    }
    setIsOpen(false);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Ada yang Hilang, Dariku Belakangan — JN UKMI UNS",
      text: "Yuk, cari lagi yang bikin hati kembali tenang. Bersama JN UKMI UNS 🍃✨",
      url: "https://jnukmi.com",
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback copy to clipboard
    try {
      await navigator.clipboard.writeText("https://jnukmi.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Copy failed
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !messageText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    const cleanName = name.trim();
    const cleanMsg = messageText.trim();

    try {
      const res = await fetch("/api/titipan-semangat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, message: cleanMsg }),
      });

      const json = await res.json();

      if (res.ok && json.ok) {
        const newItem: TitipanSemangatItem = json.data || {
          id: `temp-${Date.now()}`,
          name: cleanName,
          message: cleanMsg,
          created_at: new Date().toISOString(),
        };

        startTransition(() => {
          setMessages((prev) => [newItem, ...prev].slice(0, 10));
          setName("");
          setMessageText("");
          setFeedback({ type: "success", text: "Pesanmu berhasil dititipkan! 🌟" });
        });

        setTimeout(() => setFeedback(null), 4000);
      } else {
        setFeedback({
          type: "error",
          text: json.error || "Gagal menitipkan pesan. Coba beberapa saat lagi.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: "Terjadi kesalahan jaringan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden pointer-events-auto overscroll-contain"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            id="wrp-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wrp-title"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 350, damping: 28 }
            }
            className="relative w-full max-w-lg max-h-[85vh] sm:max-h-[88vh] flex flex-col bg-white dark:bg-gray-900 border-2 border-forest-600 dark:border-lime rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-gray-800 dark:text-gray-100 overscroll-contain"
          >
            {/* Close Button */}
            <button
              id="wrp-x"
              onClick={handleClose}
              aria-label="Tutup popup"
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 dark:bg-gray-800 text-forest-700 dark:text-lime border border-forest-200 dark:border-gray-700 transition-all hover:bg-forest-100 dark:hover:bg-gray-700 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div
              id="wrp-header"
              className="relative shrink-0 pt-6 sm:pt-8 px-6 sm:px-8 pb-4 text-center border-b border-gray-100 dark:border-gray-800 bg-forest-50/50 dark:bg-gray-900/60"
            >
              {/* Badge */}
              <div
                id="wrp-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-forest-600 dark:bg-lime text-white dark:text-forest-950 rounded-full text-xs font-bold shadow-sm mb-3"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Teh Hijau • Tulus</span>
              </div>

              <h2
                id="wrp-title"
                className="text-xl sm:text-2xl font-black text-forest-900 dark:text-lime leading-snug tracking-tight"
              >
                Ada yang Hilang,<br />Dariku Belakangan 🍃
              </h2>
              <p
                id="wrp-header-sub"
                className="text-xs sm:text-sm font-medium text-forest-700/80 dark:text-gray-400 mt-1 italic"
              >
                &ldquo;Ada yang hilang, dariku belakangan.&rdquo;
              </p>
            </div>

            {/* Body (Scrollable) */}
            <div
              id="wrp-body"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-5 text-sm touch-pan-y focus:outline-none"
            >
              {/* Intro Reflection */}
              <div
                id="wrp-desc"
                className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-forest-50/40 dark:bg-gray-800/40 p-4 rounded-2xl border border-forest-100 dark:border-gray-800 space-y-2"
              >
                <p>
                  Mungkin bukan waktumu. Bukan juga semangatmu. Tapi bisa jadi… <strong className="text-forest-900 dark:text-lime font-bold italic">arahmu.</strong>
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Belakangan ini kuliah jalan, tugas jalan, organisasi jalan—tapi hati kok rasanya <em className="italic text-forest-800 dark:text-gray-200">nggak ikut sampai tujuan?</em>
                </p>
              </div>

              {/* Feature Cards Grid */}
              <div id="wrp-features" className="space-y-3">
                {/* Feat 1: Waktu Kembali */}
                <div className="wrp-feat flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="wrp-feat-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div className="wrp-feat-text text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Tenang, gaes. 🌱</strong>
                    Kadang yang hilang bukan sesuatu yang harus dicari jauh-jauh, melainkan <span className="font-semibold text-forest-800 dark:text-lime">waktu untuk kembali dekat kepada Allah.</span>
                  </div>
                </div>

                {/* Feat 2: Arah Pulang */}
                <div className="wrp-feat flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="wrp-feat-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="wrp-feat-text text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Jangan Kehilangan Arah Pulang 🤍</strong>
                    Sebab di tengah sibuknya dunia, jangan sampai kita lupa tujuan hakiki dan kehilangan arah pulang kepada-Nya.
                  </div>
                </div>

                {/* Feat 3: Lingkungan yang Mengingatkan */}
                <div className="wrp-feat flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/80 shadow-xs hover:border-lime dark:hover:border-lime transition-all">
                  <div className="wrp-feat-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-forest-50 dark:bg-lime/10 text-forest-700 dark:text-lime border border-forest-200 dark:border-lime/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="wrp-feat-text text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    <strong className="text-forest-900 dark:text-white font-bold block mb-0.5">Temukan Ruang Bertumbuh ✨</strong>
                    Mungkin yang kamu cari bukan kegiatan baru, melainkan <span className="font-semibold text-forest-800 dark:text-lime">lingkungan yang senantiasa mengingatkanmu kepada-Nya.</span>
                  </div>
                </div>

                {/* Feat 4: Call to Action */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-forest-50 to-emerald-50/60 dark:from-forest-950/60 dark:to-gray-800/80 border border-forest-200/80 dark:border-lime/30 text-center space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-forest-950 dark:text-lime">
                    Ada yang hilang belakangan?
                  </p>
                  <p className="text-xs text-forest-700/90 dark:text-gray-300 font-medium">
                    Yuk, cari lagi yang bikin hati kembali tenang. 🍃
                  </p>
                </div>
              </div>

              {/* Titipan Semangat Section */}
              <div
                id="wrp-msg-section"
                className="pt-5 border-t border-gray-100 dark:border-gray-800 space-y-4"
              >
                <div
                  id="wrp-msg-heading"
                  className="flex items-center justify-between text-xs sm:text-sm font-bold text-forest-950 dark:text-lime"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquareHeart className="w-4 h-4 text-forest-600 dark:text-lime" />
                    <span>Ada Titipan Semangat Buatmu 💛</span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 font-normal">
                    {messages.length} pesan
                  </span>
                </div>

                {/* Messages List */}
                <div
                  id="wrp-msg-list"
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  className="space-y-2.5 max-h-60 overflow-y-auto pr-1"
                >
                  {messages.length === 0 ? (
                    <div
                      id="wrp-msg-empty"
                      className="p-4 rounded-2xl bg-forest-50/50 dark:bg-gray-800/40 text-center text-xs text-gray-500 dark:text-gray-400 border border-dashed border-forest-200 dark:border-gray-700"
                    >
                      Belum ada yang nitip semangat nih — kamu duluan dong! 🌟
                    </div>
                  ) : (
                    messages.slice(0, 10).map((item) => (
                      <div
                        key={item.id}
                        className="wrp-msg-item p-3 rounded-2xl bg-forest-50/40 dark:bg-gray-800/60 border border-forest-100/80 dark:border-gray-700/60 text-xs space-y-1 transition-all hover:border-lime/60 dark:hover:border-lime/60"
                      >
                        <div className="wrp-msg-item-header flex items-center justify-between text-[11px] gap-2">
                          <span className="wrp-msg-item-name font-bold text-forest-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className="wrp-msg-item-date font-mono text-gray-400 dark:text-gray-500 text-[10px] shrink-0">
                            {formatMessageDate(item.created_at)}
                          </span>
                        </div>
                        <div className="wrp-msg-item-text text-gray-600 dark:text-gray-300 leading-relaxed break-words font-medium">
                          {item.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Divider */}
                <div id="wrp-msg-divider" className="pt-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                  <span className="flex items-center gap-1.5 text-forest-800 dark:text-lime">
                    <PenLine className="w-3.5 h-3.5" /> Giliran Kamu Nitip ✨
                  </span>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                </div>

                {/* Form */}
                <form
                  id="wrp-msg-form"
                  onSubmit={handleSendMessage}
                  noValidate
                  className="space-y-2.5 bg-forest-50/50 dark:bg-gray-800/40 p-3.5 rounded-2xl border border-forest-100 dark:border-gray-800"
                >
                  <div id="wrp-msg-form-fields" className="space-y-2">
                    <input
                      id="wrp-msg-name"
                      type="text"
                      maxLength={80}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Namamu siapa? 😊"
                      autoComplete="off"
                      className="w-full text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-forest-600 dark:focus:border-lime focus:outline-none transition-colors text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                    />
                    <textarea
                      id="wrp-msg-text"
                      maxLength={300}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Titip kata semangat buat temanmu... 🌟"
                      rows={2}
                      className="w-full text-xs px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-forest-600 dark:focus:border-lime focus:outline-none transition-colors text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <div id="wrp-msg-form-footer" className="flex items-center justify-between gap-2">
                    <span id="wrp-msg-char" className="text-[10px] font-mono text-gray-400">
                      {messageText.length}/300
                    </span>
                    <button
                      type="submit"
                      id="wrp-msg-submit"
                      disabled={isSubmitting || !name.trim() || !messageText.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-forest-600 dark:bg-lime text-white dark:text-forest-950 rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Titip!</span>
                    </button>
                  </div>

                  {feedback && (
                    <div
                      id="wrp-msg-feedback"
                      className={`text-[11px] font-medium text-center pt-1 ${
                        feedback.type === "error"
                          ? "text-red-500 dark:text-red-400"
                          : "text-emerald-600 dark:text-lime"
                      }`}
                    >
                      {feedback.text}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Footer Actions */}
            <div
              id="wrp-footer"
              className="shrink-0 p-4 sm:p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/80 flex flex-col gap-3"
            >
              <button
                id="wrp-btn-explore"
                onClick={handleShare}
                className="group/share relative isolate inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-forest-600 dark:bg-lime text-white dark:text-forest-950 py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Link Berhasil Disalin! ✨</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Bagikan Pesan Ini ke Temanmu! 🍃</span>
                  </>
                )}
              </button>

              <div
                id="wrp-share-fallback"
                className="hidden text-center text-xs text-gray-500 dark:text-gray-400"
              >
                Salin link ini:{" "}
                <a
                  href="https://jnukmi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-forest-700 dark:text-lime underline"
                >
                  jnukmi.com
                </a>{" "}
                lalu bagikan ke Story atau teman-temanmu!
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 px-1">
                <span className="inline-flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3 text-lime" /> jnukmi.com
                </span>
                <button
                  id="wrp-btn-dismiss"
                  onClick={handleDismiss1Day}
                  className="font-medium hover:text-forest-600 dark:hover:text-lime transition-colors underline underline-offset-2 cursor-pointer focus-visible:outline-none"
                >
                  Jangan tampilkan lagi hari ini
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
