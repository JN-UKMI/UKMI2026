import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Akses Ditolak",
  robots: { index: false, follow: false, noarchive: true },
};

export default function ForbiddenLayout({ children }: { children: ReactNode }) {
  return children;
}
