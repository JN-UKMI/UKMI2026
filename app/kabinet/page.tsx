import { Metadata } from "next";
import Image from "next/image";
import kabinetData from "@/content/kabinet.json";

export const metadata: Metadata = {
  title: "Kabinet | JN UKMI",
  description: "Struktur kepengurusan Jamaah Nurul Huda UKMI",
};

const badgeColors: Record<string, string> = {
  "Ketua Umum": "bg-yellow-500",
  "Koordinator Akhwat": "bg-purple-600",
};

function badgeClass(role: string): string {
  if (badgeColors[role]) return badgeColors[role];
  if (role.startsWith("Kepala Bidang")) return "bg-emerald-600";
  if (role.startsWith("Wakil")) return "bg-blue-600";
  return "bg-gray-500";
}

function initials(name: string): string {
  return name
    .replace(/[\[\]]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export default function KabinetPage() {
  return (
    <div className="min-h-screen">
      {/* Filosofi Logo */}
      <section className="bg-gradient-to-b from-green-900 to-green-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Image
            src="/logo-jnukmi.png"
            alt="Logo JN UKMI"
            width={140}
            height={140}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Filosofi Logo
          </h1>
          <p className="text-lg text-green-100 leading-relaxed max-w-3xl mx-auto">
            {kabinetData.filosofi_logo}
          </p>
        </div>
      </section>

      {/* Pengurus Utama */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-green-900 mb-10 text-center">
          Pengurus Utama
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kabinetData.pengurus.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow"
            >
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold mx-auto mb-4">
                {initials(p.nama)}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {p.nama}
              </h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {p.fakultas}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Angkatan {p.angkatan}
              </p>
              <span
                className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium text-white ${badgeClass(p.role)}`}
              >
                {p.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
