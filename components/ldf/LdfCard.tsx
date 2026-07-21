import type { LDF } from "@/lib/types";

export interface LdfCardProps {
  ldf: LDF;
}

export function LdfCard({ ldf }: LdfCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* 1. Gambar */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
          <img
            src={ldf.gambar || "/placeholder.png"}
            alt={ldf.nama}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Container */}
        <div className="p-5">
          {/* 2. Nama LDF */}
          <h3 className="text-lg font-bold text-forest-900 leading-snug group-hover:text-forest-600 transition-colors">
            {ldf.nama}
          </h3>

          {/* 3. Deskripsi Singkat */}
          <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-3 font-medium">
            {ldf.deskripsi}
          </p>
        </div>
      </div>

      {/* 4. Tombol Menuju Instagram */}
      <div className="p-5 pt-0 mt-auto">
        <a
          href={ldf.instagram || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Kunjungi Instagram ${ldf.nama}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
        >
          <span>Kunjungi Instagram</span>
          <span className="text-sm">↗</span>
        </a>
      </div>
    </div>
  );
}
