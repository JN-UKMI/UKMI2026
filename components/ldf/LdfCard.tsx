import type { LDF } from "@/lib/types";

export interface LdfCardProps {
  ldf: LDF;
}

export function LdfCard({ ldf }: LdfCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-row sm:flex-col justify-between hover:-translate-y-1">
      <div className="flex flex-row sm:flex-col flex-1 items-stretch">
        {/* 1. Gambar */}
        <div className="relative w-28 h-auto shrink-0 sm:w-full sm:aspect-[16/10] overflow-hidden bg-gray-100">
          <img
            src={ldf.gambar || "/placeholder.png"}
            alt={ldf.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3 sm:gap-0">
          <div>
            {/* 2. Nama LDF */}
            <h3 className="text-sm sm:text-lg font-bold text-forest-900 leading-snug group-hover:text-forest-600 transition-colors">
              {ldf.nama}
            </h3>

            {/* 3. Deskripsi Singkat */}
            <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
              {ldf.deskripsi}
            </p>
          </div>

          {/* 4. Tombol Menuju Instagram (Tampil di dalam kolom kanan pada mobile, dan di bawah pada desktop) */}
          <div className="pt-1 sm:pt-4 sm:mt-auto">
            <a
              href={ldf.instagram_url || ldf.instagram || "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Kunjungi Instagram ${ldf.nama}`}
              className="flex items-center justify-center gap-1.5 sm:gap-2 w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-[11px] sm:text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              <span>Kunjungi Instagram</span>
              <span className="text-xs sm:text-sm">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
