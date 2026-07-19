import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ldfData from "@/content/ldf.json";

interface LdfItem {
  nama: string;
  deskripsi: string;
  instagram_url: string;
  gambar: string;
  contact_person: string;
  whatsapp: string;
}

export const metadata: Metadata = {
  title: "LDF | JN UKMI",
  description: "Daftar Lembaga Dakwah Fakultas (LDF) di lingkungan JN UKMI.",
};

export default function LdfPage() {
  const data = ldfData as LdfItem[];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-green-900 to-green-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Lembaga Dakwah Fakultas
          </h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            LDF adalah organisasi dakwah tingkat fakultas di lingkungan JN
            UKMI. Setiap fakultas memiliki LDF dengan ciri khasnya masing-masing.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((ldf, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* Gambar */}
              <div className="relative h-44 bg-green-50">
                <Image
                  src={ldf.gambar}
                  alt={ldf.nama}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3">
                <h3 className="font-bold text-green-900 text-lg leading-tight">
                  {ldf.nama}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ldf.deskripsi}
                </p>

                {/* Contact */}
                <div className="text-sm text-gray-700">
                  <span className="font-medium text-green-800">CP: </span>
                  {ldf.contact_person}
                  <br />
                  <span className="font-medium text-green-800">WA: </span>
                  {ldf.whatsapp}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <a
                    href={`https://wa.me/${ldf.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-sm bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                  >
                    WhatsApp
                  </a>
                  <Link
                    href={ldf.instagram_url}
                    className="flex-1 text-center text-sm bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Instagram
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
