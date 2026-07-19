import { MemberCard } from "@/components/kabinet/MemberCard";
import type { MemberCard as MemberCardType } from "@/lib/types";

interface TimSectionProps {
  staff: MemberCardType[];
}

export function TimSection({ staff }: TimSectionProps) {
  if (!staff || staff.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-forest-900 mb-8 text-center">Tim</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member, i) => (
          <MemberCard key={i} member={member} />
        ))}
      </div>
    </section>
  );
}
