import type { MemberCard as MemberCardType } from "@/lib/types";
import { MemberCard } from "@/components/kabinet/MemberCard";
import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";

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
      <SectionHeader
        icon={<ShieldCheck className="w-6 h-6" />}
        title={title}
        subtitle="Struktur pimpinan utama Kabinet Iskandar Muda Periode 2026"
      />

      {/* Baris 1: Ketua Umum & Koordinator Akhwat (2 kolom, gap lebar & seragam) */}
      <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
        {leaders.map((member) => (
          <div key={member.nama} className="w-full sm:w-[320px] flex justify-center">
            <MemberCard member={member} />
          </div>
        ))}
      </div>

      {/* Baris berikutnya: Kepala & Wakil Bidang (4 kolom dengan gap longgar lg:gap-12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0 justify-items-center">
        {mainStaff.map((member) => (
          <div key={member.nama} className="w-full sm:w-[320px] flex justify-center">
            <MemberCard member={member} />
          </div>
        ))}
      </div>

      {/* Baris sisa (Kemuslimahan): Centered pada desktop */}
      {leftoverStaff.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 max-w-[1520px] mx-auto w-full px-2 sm:px-0">
          {leftoverStaff.map((member) => (
            <div key={member.nama} className="w-full sm:w-[320px] flex justify-center">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}