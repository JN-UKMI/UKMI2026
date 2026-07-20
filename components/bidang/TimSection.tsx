import { MemberCard } from "@/components/kabinet/MemberCard";
import type { MemberCard as MemberCardType } from "@/lib/types";

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
    <section className="py-20 px-4 max-w-6xl mx-auto flex flex-col gap-10">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-forest-900 mb-2 text-center relative inline-block left-1/2 -translate-x-1/2 uppercase tracking-wider">
        Tim Kami
        <span className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-16 h-[3px] bg-lime rounded-full" />
      </h2>

      {/* Baris 1: Kepala & Wakil (2 kolom, max-w-[600px] agar pas 280px * 2 + gap) */}
      <div className="grid grid-cols-2 gap-4 md:gap-10 max-w-[600px] mx-auto w-full px-2 sm:px-0 mt-6">
        {leaders.map((member, i) => (
          <MemberCard key={i} member={member} />
        ))}
      </div>

      {/* Baris berikutnya: Staff (4 kolom, max-w-[1240px] agar pas 280px * 4 + gap) */}
      {mainStaff.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 max-w-[1240px] mx-auto w-full px-2 sm:px-0">
          {mainStaff.map((member, i) => (
            <MemberCard key={i} member={member} />
          ))}
        </div>
      )}

      {/* Baris sisa: Centered pada desktop, 2 kolom pada mobile */}
      {leftoverStaff.length > 0 && (
        <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-10 max-w-[600px] md:max-w-3xl mx-auto w-full px-2 sm:px-0">
          {leftoverStaff.map((member, i) => (
            <div key={i} className="md:w-[280px] shrink-0">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
