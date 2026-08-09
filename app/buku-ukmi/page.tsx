import { buildPageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { loadBukuUkmi } from "@/lib/content";
import { SlideIn } from "@/components/ui/SlideIn";
import {
  BookOpen,
  FileCheck,
  RotateCcw,
  HeartHandshake,
  MapPin,
  MessageCircle,
  ExternalLink,
  Quote,
  Sparkles,
  BookmarkCheck,
} from "lucide-react";

export const metadata = buildPageMetadata({
  title: 'BUMI - Perpustakaan Mini',
  description: 'BUMI (Buku UKMI) adalah perpustakaan mini JN-UKMI untuk peminjaman dan jariyah wakaf buku mahasiswa UNS.',
  path: '/buku-ukmi',
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SlideButton({ label, href: _href }: { label: string; href?: string }) {
  return (
    <div className="group/action relative isolate inline-flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-forest-600 dark:border-lime bg-transparent px-3 py-2.5 text-xs font-bold text-forest-700 dark:text-lime transition-colors duration-300 motion-reduce:transition-none">
      <span aria-hidden className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/action:translate-x-0" />
      <span className="relative z-10 transition-colors duration-300 motion-reduce:transition-none group-hover/action:text-white dark:group-hover/action:text-forest-950">{label}</span>
      <ExternalLink className="relative z-10 h-4 w-4 transition-transform duration-300 motion-safe:group-hover/action:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none group-hover/action:text-white dark:group-hover/action:text-forest-950" />
    </div>
  );
}

export default async function BukuUkmiPage() {
  const data = await loadBukuUkmi();

  return (
    <div className="min-h-screen bg-transparent pb-20 transition-colors duration-300">
      <PageHero
        badge="Sekretaris Umum"
        title="BUKU UKMI (BUMI)"
        subtitle="Perpustakaan Mini JN UKMI & Program Jariyah Buku. Tempat pinjam buku, menambah wawasan, dan berbagi keberkahan ilmu."
      />

      <main className="max-w-6xl mx-auto px-4 pt-12 flex flex-col gap-16">
        
        {/* 1. QUICK ACTION CARDS */}
        <SlideIn direction="left">
          <section>
            <SectionHeader
              icon={<BookOpen className="w-6 h-6" />}
              title="Layanan Perpustakaan BUMI"
              subtitle="Akses cepat untuk melihat katalog koleksi, mengisi form peminjaman, dan pengembalian buku"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href={data.links.daftar_buku} target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-forest-600 dark:border-lime shadow-sm motion-safe:hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="card-title-underline text-lg font-black text-forest-900 dark:text-lime mb-2 leading-[1.75] group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">Katalog Koleksi Buku</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Cek seluruh daftar judul buku keislaman, akademik, dan motivasi yang tersedia di BUMI.</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SlideButton href={data.links.daftar_buku} label="Cek Daftar Buku" />
                </div>
              </a>
              <a href={data.links.peminjaman} target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-forest-600 dark:border-lime shadow-sm motion-safe:hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <h3 className="card-title-underline text-lg font-black text-forest-900 dark:text-lime mb-2 leading-[1.75] group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">Pinjam Buku</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Isi formulir peminjaman online untuk meminjam buku pilihanmu dari perpustakaan BUMI.</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SlideButton href={data.links.peminjaman} label="Isi Form Pinjam" />
                </div>
              </a>
              <a href={data.links.pengembalian} target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-forest-600 dark:border-lime shadow-sm motion-safe:hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <h3 className="card-title-underline text-lg font-black text-forest-900 dark:text-lime mb-2 leading-[1.75] group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">Kembalikan Buku</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Sudah selesai membaca? Konfirmasi pengembalian buku di sini agar bisa dipinjam teman lain.</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SlideButton href={data.links.pengembalian} label="Form Pengembalian" />
                </div>
              </a>
              <a href={data.links.jariyah_bumi} target="_blank" rel="noopener noreferrer" className="group bg-white dark:bg-gray-900 rounded-3xl p-6 border-2 border-forest-600 dark:border-lime shadow-sm motion-safe:hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h3 className="card-title-underline text-lg font-black text-forest-900 dark:text-lime mb-2 leading-[1.75] group-hover:text-forest-600 dark:group-hover:text-lime transition-colors">Jariyah BUMI</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">Partisipasi dalam donasi atau peminjaman sementara buku agar menjadi ilmu bermanfaat.</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <SlideButton href={data.links.jariyah_bumi} label="Info Jariyah BUMI" />
                </div>
              </a>
            </div>
          </section>
        </SlideIn>

        {/* 2. PROGRAM JARIYAH BUMI */}
        <SlideIn direction="right">
          <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 border-2 border-forest-600 dark:border-lime shadow-sm transition-colors">
            <SectionHeader
              icon={<Sparkles className="w-6 h-6" />}
              title="Program Jariyah BUMI"
              subtitle="Yuk berbagi buku untuk teman-teman lain agar ilmu jadi lebih berkah lewat 2 pilihan donasi:"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {data.jariyah_options.map((opt, i) => (
                <div key={i} className="bg-gray-50/80 dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between gap-3 hover:border-forest-600/40 dark:hover:border-lime/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookmarkCheck className="w-5 h-5 text-forest-600 dark:text-lime" />
                      <h4 className="text-base font-black text-forest-900 dark:text-lime">{opt.title}</h4>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 bg-forest-600/10 dark:bg-forest-900/50 text-forest-700 dark:text-lime rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 border border-forest-600/20 dark:border-forest-800">{opt.subtitle}</span>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-forest-50 dark:bg-gray-800/80 border border-forest-100 dark:border-gray-700 rounded-2xl p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs font-bold text-forest-800 dark:text-lime uppercase tracking-widest block mb-0.5">🌟 Himbauan Partisipasi Bidang:</span>
                <p className="text-xs text-forest-900 dark:text-gray-200 font-medium">Setiap bidang di lingkungan JN UKMI diharapkan ikut berpartisipasi minimal menyumbang 2 buku.</p>
              </div>
              <a href={data.links.jariyah_bumi} target="_blank" rel="noopener noreferrer" className="group/jariyah relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-forest-600 dark:border-lime bg-transparent px-5 py-2 text-xs font-bold text-forest-700 dark:text-lime shadow-sm transition-colors duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                <span aria-hidden className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/jariyah:translate-x-0" />
                <span className="relative z-10 transition-colors duration-300 motion-reduce:transition-none group-hover/jariyah:text-white dark:group-hover/jariyah:text-forest-950">Ikut Jariyah Buku</span>
              </a>
            </div>
          </section>
        </SlideIn>

        {/* 3. LOKASI & NARAHUBUNG */}
        <SlideIn direction="right">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-forest-600 dark:border-lime shadow-sm flex flex-col justify-between transition-all duration-300 motion-safe:hover:-translate-y-1">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-base font-black text-forest-900 dark:text-lime">Lokasi Peminjaman</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sekretariat JN UKMI Universitas Sebelas Maret</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6">Silakan datang langsung ke lokasi Sekretariat JN UKMI untuk melakukan pemanfaatan buku atau pengambilan/pengembalian fisik buku.</p>
              </div>
              <a href={data.links.lokasi_maps} target="_blank" rel="noopener noreferrer" className="group/maps relative isolate inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border border-forest-600 dark:border-lime bg-transparent py-3 text-xs font-bold text-forest-700 dark:text-lime shadow-md transition-colors duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                <span aria-hidden className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/maps:translate-x-0" />
                <span className="relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300 motion-reduce:transition-none group-hover/maps:text-white dark:group-hover/maps:text-forest-950"><MapPin className="h-4 w-4" /> Buka Google Maps Lokasi</span>
              </a>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 border-forest-600 dark:border-lime shadow-sm flex flex-col justify-between transition-all duration-300 motion-safe:hover:-translate-y-1">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-600/10 dark:bg-forest-900/50 text-forest-600 dark:text-lime flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-base font-black text-forest-900 dark:text-lime">Narahubung Resmi</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ada pertanyaan seputar peminjaman atau jariyah?</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6">Hubungi tim Sekretaris Umum (SEKUM) JN UKMI untuk konfirmasi dan bantuan peminjaman:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.narahubung.map((contact, i) => (
                  <a key={i} href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="group/whatsapp relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-forest-600 dark:border-lime bg-transparent p-3 text-xs font-bold text-forest-700 dark:text-lime transition-colors duration-300 motion-safe:active:scale-95 motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50">
                    <span aria-hidden className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-forest-600 dark:bg-lime motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-reduce:!translate-x-0 motion-reduce:!opacity-0 group-hover/whatsapp:translate-x-0" />
                    <span className="relative z-10 inline-flex items-center justify-center gap-2 transition-colors duration-300 motion-reduce:transition-none group-hover/whatsapp:text-white dark:group-hover/whatsapp:text-forest-950"><MessageCircle className="h-4 w-4" /> <span>WhatsApp {contact.nama}</span></span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </SlideIn>

        {/* 4. QUOTE MUTIARA */}
        <SlideIn direction="left">
          <section className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-lg">
            <Quote className="w-12 h-12 text-lime/30 mx-auto mb-4" />
            <blockquote className="text-base sm:text-lg md:text-xl font-semibold italic max-w-2xl mx-auto leading-relaxed mb-4">&ldquo;{data.quote.text}&rdquo;</blockquote>
            <cite className="text-xs sm:text-sm font-bold font-mono text-lime uppercase tracking-widest not-italic">— {data.quote.author}</cite>
          </section>
        </SlideIn>

      </main>
    </div>
  );
}
