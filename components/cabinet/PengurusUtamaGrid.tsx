import type { MemberCard as MemberCardType } from "@/lib/types";
import { MemberCard } from "@/components/kabinet/MemberCard";

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

  return (
    <section className="mb-16 flex flex-col gap-10">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 text-center uppercase tracking-wider">{title}</h2>
      
      {/* Baris 1: Ketua Umum & Koordinator Akhwat (2 kolom, max-w-[600px] agar pas 280px * 2 + gap) */}
      <div className="grid grid-cols-2 gap-4 md:gap-10 max-w-[600px] mx-auto w-full px-2 sm:px-0">
        {leaders.map((member) => (
          <MemberCard key={member.nama} member={member} />
        ))}
      </div>

      {/* Baris berikutnya: Kepala & Wakil Bidang (4 kolom, max-w-[1240px] agar pas 280px * 4 + gap) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 max-w-[1240px] mx-auto w-full px-2 sm:px-0">
        {mainStaff.map((member) => (
          <MemberCard key={member.nama} member={member} />
        ))}
      </div>

      {/* Baris sisa (Kemuslimahan): Centered pada desktop, 2 kolom pada mobile */}
      {leftoverStaff.length > 0 && (
        <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-10 max-w-[600px] md:max-w-3xl mx-auto w-full px-2 sm:px-0">
          {leftoverStaff.map((member) => (
            <div key={member.nama} className="md:w-[280px] shrink-0">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}