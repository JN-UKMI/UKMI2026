"use client";

import type { MemberCard as MemberCardType } from "@/lib/types";
import { MemberCard } from "@/components/kabinet/MemberCard";
import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SlideIn } from "@/components/ui/SlideIn";

interface PengurusUtamaGridProps {
  members: MemberCardType[];
  title?: string;
}

export function PengurusUtamaGrid({
  members,
  title = "Pengurus Harian Tetap",
}: PengurusUtamaGridProps) {
  const leaders = members.slice(0, 2);
  const staff = members.slice(2);

  // Split staff into full rows of 4 on desktop, and leftovers at the bottom
  const fullRowsCount = Math.floor(staff.length / 4) * 4;
  const mainStaff = staff.slice(0, fullRowsCount);
  const leftoverStaff = staff.slice(fullRowsCount);

  // Chunk mainStaff into sub-rows of 4 so each visual row gets its own SlideIn
  const staffRows: MemberCardType[][] = [];
  for (let i = 0; i < mainStaff.length; i += 4) {
    staffRows.push(mainStaff.slice(i, i + 4));
  }

  return (
    <section className="py-20 px-4 max-w-[1520px] mx-auto flex flex-col gap-10">
      <SectionHeader
        icon={<ShieldCheck className="w-6 h-6" />}
        title={title}
        subtitle="Struktur pimpinan utama Kabinet Iskandar Muda Periode 2026"
      />

      {/* Layout Mobile: Horizontal Carousel */}
      <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-none">
        {members.map((member) => (
          <div key={member.nama} className="shrink-0 w-[290px] snap-center flex justify-center">
            <MemberCard member={member} />
          </div>
        ))}
      </div>

      {/* Desktop Layout (sm:flex/grid) */}
      <div className="hidden sm:flex flex-col gap-10">
        {/* Baris 1: Pimpinan Utama (2 kolom) */}
        <SlideIn direction="left" stagger className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full">
          {leaders.map((member) => (
            <div key={member.nama} className="w-[320px] flex justify-center">
              <MemberCard member={member} />
            </div>
          ))}
        </SlideIn>

        {/* Baris 2+: Kepala & Wakil Bidang — each sub-row of 4 gets its own SlideIn */}
        {staffRows.map((row, i) => (
          <SlideIn
            key={row[0].nama}
            direction={i % 2 === 0 ? "right" : "left"}
            stagger
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full justify-items-center"
          >
            {row.map((member) => (
              <div key={member.nama} className="w-full max-w-[320px] flex justify-center">
                <MemberCard member={member} />
              </div>
            ))}
          </SlideIn>
        ))}

        {/* Baris 3: Sisa Staff */}
        {leftoverStaff.length > 0 && (
          <SlideIn direction="left" stagger className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full">
            {leftoverStaff.map((member) => (
              <div key={member.nama} className="w-[320px] flex justify-center">
                <MemberCard member={member} />
              </div>
            ))}
          </SlideIn>
        )}
      </div>
    </section>
  );
}