import type { MemberCard as MemberCardType } from "@/lib/types";
import { HeroSection } from "./HeroSection";
import { DeskripsiSection } from "./DeskripsiSection";
import { ProgramKerjaCarousel } from "./ProgramKerjaCarousel";
import { TimSection } from "./TimSection";

export interface BidangPageProps {
  name: string;
  slug: string;
  deskripsi: string;
  instagram_url: string;
  program_kerja: Array<{ title: string; description: string }>;
  staff: MemberCardType[];
}

export function BidangTemplate({
  name,
  slug,
  deskripsi,
  instagram_url,
  program_kerja,
  staff,
}: BidangPageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection name={name} slug={slug} instagram_url={instagram_url} />
      <DeskripsiSection deskripsi={deskripsi} />
      <ProgramKerjaCarousel program_kerja={program_kerja} />
      <TimSection staff={staff} />
    </div>
  );
}