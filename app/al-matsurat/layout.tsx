import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: 'Al-Ma’tsurat',
  description: 'Dzikir pagi dan petang berdasarkan Al-Quran dan Hadist',
  path: '/al-matsurat',
});

export default function AlMasuratLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
