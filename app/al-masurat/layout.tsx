import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Al-Ma'surat | JN UKMI",
  description: "Dzikir pagi dan petang berdasarkan Al-Quran dan Hadist",
};

export default function AlMasuratLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
