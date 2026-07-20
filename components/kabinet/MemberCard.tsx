import Image from "next/image";
import type { MemberCard as MemberCardInterface } from "@/lib/types";

interface MemberCardProps {
  member: MemberCardInterface;
}

const initials: (name: string) => string = (name) =>
  name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

export function MemberCard({ member }: MemberCardProps) {
  // Determine gradient/color theme based on role
  let roleTheme = {
    bgGrad: "from-forest-600 to-forest-900",
    textLight: "text-forest-100",
    barcodeClass: "opacity-40"
  };

  if (member.role.includes("Ketua") || member.role.includes("Koordinator")) {
    roleTheme = {
      bgGrad: "from-amber-500 to-amber-700",
      textLight: "text-amber-100",
      barcodeClass: "opacity-60"
    };
  } else if (member.role.includes("Sekretaris") || member.role.includes("Bendahara")) {
    roleTheme = {
      bgGrad: "from-teal-600 to-teal-800",
      textLight: "text-teal-100",
      barcodeClass: "opacity-50"
    };
  }

  return (
    <div className="relative mx-auto w-full md:w-[280px] h-full bg-white rounded-[2rem] shadow-[0_12px_35px_-12px_rgba(0,0,0,0.08)] border border-gray-200/50 p-6 flex flex-col items-center justify-between hover:shadow-[0_22px_45px_-12px_rgba(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1">
      {/* Lanyard Hole Clip Representation */}
      <div className="w-14 h-3 bg-gray-200 rounded-full mb-5 shadow-inner" />

      {/* Profile Photo Frame (Large Square shape, fully responsive w-full aspect-square on mobile, md:w-52 md:h-52 on desktop) */}
      <div className="relative w-full aspect-square md:w-52 md:h-52 bg-gray-50 border border-gray-200/50 rounded-2xl overflow-hidden mb-5 shadow-inner flex items-center justify-center text-gray-400 font-extrabold text-3xl select-none">
        {member.foto && member.foto !== "/placeholder.png" && member.foto !== "/public/placeholder.png" ? (
          <Image
            src={member.foto}
            alt={member.nama}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <span className="font-mono tracking-wider opacity-55">{initials(member.nama)}</span>
        )}

        {/* Job Title Overlay in Front of Photo */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
          <div className={`py-2 px-3 rounded-xl bg-gradient-to-r ${roleTheme.bgGrad} text-white text-center text-[10px] md:text-xs font-black uppercase tracking-wider shadow-md backdrop-blur-sm bg-opacity-95 leading-none`}>
            {member.role}
          </div>
        </div>
      </div>

      {/* Member Details */}
      <div className="w-full text-center flex flex-col gap-1">
        <h3 className="font-black text-gray-900 text-base tracking-tight leading-tight line-clamp-1">
          {member.nama}
        </h3>
        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider leading-none">
          {member.fakultas}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] font-bold text-gray-400 font-mono">
          <span>Angkatan {member.angkatan}</span>
          <span className="text-gray-300">•</span>
          <span className="text-forest-600 font-black">ID: {member.angkatan}{initials(member.nama)}</span>
        </div>
      </div>

      {/* Card Footer Barcode representation */}
      <div className="w-full mt-5 pt-4 border-t border-dashed border-gray-150/70 flex flex-col items-center gap-1">
        {/* barcode representation lines */}
        <div className={`flex gap-[2.5px] items-center h-5 ${roleTheme.barcodeClass}`}>
          <div className="w-[2px] h-full bg-gray-900" />
          <div className="w-[4px] h-full bg-gray-900" />
          <div className="w-[1px] h-full bg-gray-900" />
          <div className="w-[2.5px] h-full bg-gray-900" />
          <div className="w-[2px] h-full bg-gray-900" />
          <div className="w-[5px] h-full bg-gray-900" />
          <div className="w-[1px] h-full bg-gray-900" />
          <div className="w-[3px] h-full bg-gray-900" />
          <div className="w-[2px] h-full bg-gray-900" />
          <div className="w-[4px] h-full bg-gray-900" />
        </div>
        <span className="text-[7px] text-gray-400 font-mono tracking-widest uppercase font-extrabold">Kabinet Iskandar Muda</span>
      </div>
    </div>
  );
}
