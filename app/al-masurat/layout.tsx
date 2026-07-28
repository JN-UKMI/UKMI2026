import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata = buildPageMetadata({
  title: 'Al-Ma’surat',
  description: 'Dzikir pagi dan petang berdasarkan Al-Quran dan Hadist',
  path: '/al-masurat',
});

export default function AlMasuratLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
