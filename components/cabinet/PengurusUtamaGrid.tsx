import type { MemberCard as MemberCardType } from "@/lib/types";
import { MemberCard } from "@/components/kabinet/MemberCard";

interface PengurusUtamaGridProps {
  members: MemberCardType[];
  title?: string;
}

export function PengurusUtamaGrid({
  members,
  title = "Pengurus Utama",
}: PengurusUtamaGridProps) {
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <MemberCard key={member.nama} member={member} />
        ))}
      </div>
    </section>
  );
}