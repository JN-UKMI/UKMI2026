import { MemberCard } from "@/components/kabinet/MemberCard";
import type { MemberCard as MemberCardType } from "@/lib/types";
import { Users } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

interface TimSectionProps {
  staff: MemberCardType[];
}

export function TimSection({ staff }: TimSectionProps) {
  if (!staff || staff.length === 0) return null;

  // Split into leaders (first 2, e.g. Kepala & Wakil) and the rest of the staff
  const leaders = staff.slice(0, 2);
  const remainingStaff = staff.slice(2);

  // Split staff into full rows of 4 on desktop, and leftovers at the bottom
  const fullRowsCount = Math.floor(remainingStaff.length / 4) * 4;
  const mainStaff = remainingStaff.slice(0, fullRowsCount);
  const leftoverStaff = remainingStaff.slice(fullRowsCount);

  return (
    <section className="py-20 px-4 max-w-[1520px] mx-auto flex flex-col gap-10">
      <SectionHeader
        icon={<Users className="w-6 h-6" />}
        title="Tim Kami"
        subtitle="Pimpinan dan seluruh staf pengurus bidang"
      />

      {/* Baris 1: Kepala & Wakil (2 kolom, gap longgar) */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
        {leaders.map((member, i) => (
          <div key={i} className="w-full sm:w-[320px] flex justify-center">
            <MemberCard member={member} />
          </div>
        ))}
      </div>

      {/* Baris berikutnya: Staff (4 kolom dengan gap longgar lg:gap-12) */}
      {mainStaff.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0 justify-items-center">
          {mainStaff.map((member, i) => (
            <div key={i} className="w-full sm:w-[320px] flex justify-center">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      )}

      {/* Baris sisa: Centered pada desktop */}
      {leftoverStaff.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
          {leftoverStaff.map((member, i) => (
            <div key={i} className="w-full sm:w-[320px] flex justify-center">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
