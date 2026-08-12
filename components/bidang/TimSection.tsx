"use client";

import { MemberCard } from "@/components/kabinet/MemberCard";
import type { MemberCard as MemberCardType } from "@/lib/types";
import { Users } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SlideIn } from "@/components/ui/SlideIn";

interface TimSectionProps {
  staff: MemberCardType[];
}

export function TimSection({ staff }: TimSectionProps) {
  if (!staff || staff.length === 0) return null;

  // Split into Bidang Leaders (first 2, e.g. Kabid & Sekbid) and the rest
  const leaders = staff.slice(0, 2);
  const remaining = staff.slice(2);

  // Separate Dept Leaders (Kadep & Sekdep) and Staf
  const deptLeaders = remaining.filter((m) =>
    m.role.includes("Kepala Departemen") || m.role.includes("Sekretaris Departemen")
  );

  // Regular staff, sorted alphabetically by name
  const regularStaff = remaining
    .filter(
      (m) =>
        !m.role.includes("Kepala Departemen") &&
        !m.role.includes("Sekretaris Departemen")
    )
    .sort((a, b) => a.nama.localeCompare(b.nama, "id"));

  // Combined ordered staff starting after Kabid/Sekbid
  const orderedStaff = [...deptLeaders, ...regularStaff];

  // Also build mobile full ordered list
  const mobileOrderedList = [...leaders, ...orderedStaff];

  // Split staff into full rows of 4 on desktop, and leftovers at the bottom
  const fullRowsCount = Math.floor(orderedStaff.length / 4) * 4;
  const mainStaff = orderedStaff.slice(0, fullRowsCount);
  const leftoverStaff = orderedStaff.slice(fullRowsCount);

  // Chunk mainStaff into sub-rows of 4 so each visual row gets its own SlideIn
  const staffRows: MemberCardType[][] = [];
  for (let i = 0; i < mainStaff.length; i += 4) {
    staffRows.push(mainStaff.slice(i, i + 4));
  }

  return (
    <section className="py-10 sm:py-14 px-4 max-w-[1520px] mx-auto flex flex-col gap-10">
      <SectionHeader
        icon={<Users className="w-6 h-6" />}
        title="Tim Kami"
        subtitle="Pimpinan dan seluruh staf pengurus bidang"
      />

      {/* Layout Mobile: Horizontal Carousel */}
      <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-none">
        {mobileOrderedList.map((member, i) => (
          <div key={i} className="shrink-0 w-[290px] snap-center flex justify-center">
            <MemberCard member={member} />
          </div>
        ))}
      </div>

      {/* Desktop Layout — each row gets its own SlideIn */}
      <div className="hidden sm:flex flex-col gap-10">
        {/* Baris 1: Kepala & Wakil */}
        <SlideIn direction="left" stagger className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
          {leaders.map((member, i) => (
            <div key={i} className="w-[320px] flex justify-center">
              <MemberCard member={member} />
            </div>
          ))}
        </SlideIn>

        {/* Baris 2+: Staff — each sub-row of 4 gets its own SlideIn */}
        {staffRows.map((row, i) => (
          <SlideIn
            key={row[0].nama}
            direction={i % 2 === 0 ? "right" : "left"}
            stagger
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0 justify-items-center"
          >
            {row.map((member, j) => (
              <div key={j} className="w-full max-w-[320px] flex justify-center">
                <MemberCard member={member} />
              </div>
            ))}
          </SlideIn>
        ))}

        {/* Baris sisa: Centered */}
        {leftoverStaff.length > 0 && (
          <SlideIn direction="left" stagger className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
            {leftoverStaff.map((member, i) => (
              <div key={i} className="w-[320px] flex justify-center">
                <MemberCard member={member} />
              </div>
            ))}
          </SlideIn>
        )}
      </div>
    </section>
  );
}
