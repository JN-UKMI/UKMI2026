"use client";

import { MemberCard } from "@/components/kabinet/MemberCard";
import type { MemberCard as MemberCardType } from "@/lib/types";
import { Users } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion";

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

  return (
    <section className="py-20 px-4 max-w-[1520px] mx-auto flex flex-col gap-10">
      <FadeIn className="mb-10">
        <SectionHeader
          icon={<Users className="w-6 h-6" />}
          title="Tim Kami"
          subtitle="Pimpinan dan seluruh staf pengurus bidang"
        />
      </FadeIn>

      {/* Layout Mobile: Horizontal Carousel / Layout Desktop: Grid Hierarki */}
      <StaggerContainer className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 scrollbar-none">
        {mobileOrderedList.map((member, i) => (
          <StaggerItem key={i} className="shrink-0 w-[290px] snap-center flex justify-center">
            <MemberCard member={member} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Desktop Layout (sm:flex/grid) */}
      <StaggerContainer className="hidden sm:flex flex-col gap-10">
        {/* Baris 1: Kepala & Wakil (2 kolom, gap longgar) */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
          {leaders.map((member, i) => (
            <StaggerItem key={i} className="w-[320px] flex justify-center">
              <MemberCard member={member} />
            </StaggerItem>
          ))}
        </div>

        {/* Baris berikutnya: Staff (4 kolom dengan gap longgar lg:gap-12) */}
        {mainStaff.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0 justify-items-center">
            {mainStaff.map((member, i) => (
              <StaggerItem key={i} className="w-full max-w-[320px] flex justify-center">
                <MemberCard member={member} />
              </StaggerItem>
            ))}
          </div>
        )}

        {/* Baris sisa: Centered pada desktop */}
        {leftoverStaff.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
            {leftoverStaff.map((member, i) => (
              <StaggerItem key={i} className="w-[320px] flex justify-center">
                <MemberCard member={member} />
              </StaggerItem>
            ))}
          </div>
        )}
      </StaggerContainer>
    </section>
  );
}
