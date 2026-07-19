import Image from "next/image";
import type { MemberCard as MemberCardInterface } from "@/lib/types";

interface MemberCardProps {
  member: MemberCardInterface;
}

const ROLE_COLORS: Record<string, string> = {
  "Ketua Umum": "bg-amber-600",
  "Koordinator Akhwat": "bg-purple-600",
  "Kepala Bidang": "bg-emerald-600",
  Wakil: "bg-blue-600",
  Staff: "bg-slate-600",
};

const initials: (name: string) => string = (name) =>
  name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

export function MemberCard({ member }: MemberCardProps) {
  const roleColor = ROLE_COLORS[member.role] || "bg-slate-600";

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 w-fit mx-auto">
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 text-lg font-bold mx-auto mb-3 overflow-hidden">
        {member.foto && member.foto !== "/public/placeholder.png" ? (
          <Image
            src={member.foto}
            alt={`${member.nama}`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          initials(member.nama)
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm mb-1">{member.nama}</h3>
      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{member.fakultas}</p>
      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-medium text-white ${roleColor}`}>
        {member.role}
      </span>
    </div>
  );
}
