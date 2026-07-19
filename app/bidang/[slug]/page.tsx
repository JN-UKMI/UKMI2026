import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import fs from "fs";
import path from "path";

interface BidangData {
  name: string;
  slug: string;
  deskripsi: string;
  instagram_url: string;
  program_kerja: { title: string; description: string }[];
  staff: { nama: string; fakultas: string; angkatan: string; foto: string; role: string }[];
}

const SLUGS = ["eksternal", "internal", "syiar", "media", "bendahara", "sekretaris"] as const;

function getBidangData(slug: string): BidangData | null {
  try {
    const filePath = path.join(process.cwd(), "content", "bidang", `${slug}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as BidangData;
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getBidangData(slug);
  if (!data) return { title: "Bidang Tidak Ditemukan - JN UKMI" };
  return { title: `${data.name} - JN UKMI`, description: data.deskripsi };
}

export default async function BidangPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getBidangData(slug);
  if (!data) notFound();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-green-900 to-green-700 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.name}</h1>
          <Link
            href={data.instagram_url}
            className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram ↗
          </Link>
        </div>
      </section>

      {/* Deskripsi */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-green-900 mb-6">
          Tentang Bidang {data.name}
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">{data.deskripsi}</p>
      </section>

      {/* Program Kerja */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-green-900 mb-8 text-center">
            Program Kerja
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {data.program_kerja.map((prog, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 bg-green-100 text-green-700 rounded-lg flex items-center justify-center font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-green-900 mb-2">{prog.title}</h3>
                <p className="text-gray-600 text-sm">{prog.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-green-900 mb-8 text-center">
          Tim {data.name}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.staff.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center"
            >
              <Image
                src={member.foto}
                alt={member.nama}
                width={80}
                height={80}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold text-green-900">{member.nama}</h3>
              <p className="text-gray-500 text-sm">{member.fakultas}</p>
              <p className="text-gray-400 text-xs">Angkatan {member.angkatan}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
