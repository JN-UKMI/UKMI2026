import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadBidang } from "@/lib/content";
import { BidangTemplate } from "@/components/bidang/BidangTemplate";

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
    return { title: `${data.name} | JN UKMI`, description: data.deskripsi || data.description };
  } catch {
    return { title: "Bidang Tidak Ditemukan | JN UKMI" };
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
  };

  return <BidangTemplate {...formattedData} />;
}
