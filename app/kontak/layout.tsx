import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: "Kontak JN UKMI UNS",
  description:
    "Hubungi JN UKMI UNS untuk kerja sama, media partner, kegiatan Islam, dan informasi organisasi mahasiswa Islam Universitas Sebelas Maret.",
  path: "/kontak",
  tags: ["kontak JN UKMI", "JN UKMI UNS", "organisasi Islam UNS"],
});

export default function KontakLayout({ children }: { children: ReactNode }) {
  return children;
}
