import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Memuat",
  robots: { index: false, follow: false, noarchive: true },
};

export default function LoadingLayout({ children }: { children: ReactNode }) {
  return children;
}
