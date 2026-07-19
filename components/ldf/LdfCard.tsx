import type { LDF } from "@/lib/types"

export interface LdfCardProps {
  ldf: LDF
}

export function LdfCard({ ldf }: LdfCardProps) {
  const whatsappUrl = ldf.whatsapp.replace(/\s/g, "")
  return (
    <div className="rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <img
        src={ldf.gambar}
        alt={ldf.nama}
        className="h-48 w-full object-cover rounded-t-lg bg-muted"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold leading-tight text-forest-900">
          {ldf.nama}
        </h3>
        <p className="mt-2 text-sm text-slate-600 line-clamp-3">
          {ldf.deskripsi}
        </p>

        <a
          href={ldf.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Kunjungi Instagram ${ldf.nama}`}
          className="mt-3 inline-block text-sm font-medium text-forest-600 hover:text-forest-800"
        >
          Instagram
        </a>

        <div className="mt-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
            Hubungi
          </h4>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {ldf.contact_person}
          </p>

          <a
            href={`https://wa.me/${whatsappUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Hubungi WhatsApp: ${ldf.contact_person}`}
            className="mt-3 block w-full rounded-lg bg-forest-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-forest-800 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
