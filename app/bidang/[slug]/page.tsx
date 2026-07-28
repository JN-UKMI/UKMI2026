import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadBidang } from "@/lib/content";
import { BidangTemplate } from "@/components/bidang/BidangTemplate";
import { buildPageMetadata } from "@/lib/page-metadata";

const SLUGS = ["eksternal", "internal", "syiar", "media", "bendahara", "sekretaris", "kemuslimahan"] as const;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const data = await loadBidang(slug);
    return buildPageMetadata({
      title: data.name,
      description:
        data.deskripsi || data.description || `Bidang ${data.name} dalam struktur kepengurusan JN UKMI UNS.`,
      path: `/bidang/${slug}`,
      tags: ["bidang UKMI", data.name, "kabinet Iskandar Muda"],
    });
  } catch {
    return buildPageMetadata({
      title: "Bidang Tidak Ditemukan",
      description:
        "Bidang yang Anda cari tidak ditemukan dalam struktur kepengurusan JN UKMI.",
      path: `/bidang/${slug}`,
      noindex: true,
    });
  }
}
export default async function BidangPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data;
  try {
    data = await loadBidang(slug);
  } catch {
    notFound();
  }
  if (!data) notFound();

  const formattedData = {
    ...data,
    deskripsi: data.deskripsi || data.description || "",
    instagram_url: data.instagram_url || data.instagram || "https://www.instagram.com/jnukmiuns/",
    tentang_cards: data.tentang_cards || [],
  };

  return <BidangTemplate {...formattedData} />;
}
