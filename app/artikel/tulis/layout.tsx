import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Tulis Artikel",
  robots: { index: false, follow: false, noarchive: true },
};

export default function WriteArticleLayout({ children }: { children: ReactNode }) {
  return children;
}
