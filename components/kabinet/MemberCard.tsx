import Image from "next/image";
import type { MemberCard as MemberCardInterface } from "@/lib/types";

interface MemberCardProps {
  member: MemberCardInterface;
}

const initials = (name: string) =>
  name
    .replace(/[[\]]/g, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

export function MemberCard({ member }: MemberCardProps) {
  // Extract role short title for top-right header
  const getShortRole = (role: string) => {
    if (role.includes("Ketua Umum")) return "KETUA";
    if (role.includes("Koordinator")) return "KORAH";
    if (role.includes("Kepala Bidang")) return "KABID";
    if (role.includes("Wakil")) return "WAKABID";
    if (role.includes("Sekretaris")) return "SEKRETARIS";
    if (role.includes("Bendahara")) return "BENDAHARA";
    return "PENGURUS";
  };

  // Helper to map full faculty names to short official UNS abbreviations (FMIPA, FKIP, FT, FEB, FIB, FISIP, FH, FK, FP, FSRD, SV, etc.)
  const getFacultyAbbreviation = (fakultas: string) => {
    if (!fakultas) return "FMIPA";
    const fUpper = fakultas.trim().toUpperCase();

    if (["FMIPA", "FKIP", "FT", "FEB", "FIB", "FISIP", "FH", "FK", "FP", "FSRD", "FKOR", "SV", "FATISDA"].includes(fUpper)) {
      return fUpper;
    }
    if (fUpper === "MIPA") return "FMIPA";

    if (fUpper.includes("KEGURUAN") || fUpper.includes("KIP")) return "FKIP";
    if (fUpper.includes("TEKNIK")) return "FT";
    if (fUpper.includes("EKONOMI") || fUpper.includes("BISNIS")) return "FEB";
    if (fUpper.includes("BUDAYA") || fUpper.includes("SASTRA")) return "FIB";
    if (fUpper.includes("SOSIAL") || fUpper.includes("POLITIK") || fUpper.includes("ISIP")) return "FISIP";
    if (fUpper.includes("HUKUM")) return "FH";
    if (fUpper.includes("KEDOKTERAN")) return "FK";
    if (fUpper.includes("PERTANIAN")) return "FP";
    if (fUpper.includes("SENI") || fUpper.includes("DESAIN")) return "FSRD";
    if (fUpper.includes("VOKASI")) return "SV";
    if (fUpper.includes("OLAHRA")) return "FKOR";

    return fUpper;
  };

  // Helper to format/generate 1-line NIM code matching sample card format: "FMIPA M0323059"
  const getNimCode = (fakultas: string, angkatan?: string, nama?: string) => {
    if (member.nim) return member.nim;
    const fUpper = (fakultas || "").toUpperCase();
    let prefix = "M03";
    if (fUpper.includes("FKIP") || fUpper.includes("KIP")) prefix = "K12";
    else if (fUpper.includes("TEKNIK") || fUpper.includes("FT")) prefix = "I01";
    else if (fUpper.includes("EKONOMI") || fUpper.includes("FEB")) prefix = "F02";
    else if (fUpper.includes("HUKUM") || fUpper.includes("FH")) prefix = "E00";
    else if (fUpper.includes("KEDOKTERAN") || fUpper.includes("FK")) prefix = "G00";
    else if (fUpper.includes("FIB") || fUpper.includes("FSSR") || fUpper.includes("BUDAYA")) prefix = "C01";
    else if (fUpper.includes("FISIP") || fUpper.includes("SOSIAL")) prefix = "D02";
    else if (fUpper.includes("FP") || fUpper.includes("PERTANIAN")) prefix = "H01";
    
    const year = (angkatan || "23").slice(-2);
    const hash = ((nama || "A").charCodeAt(0) * 17 + (nama || "A").length * 31) % 800 + 100;
    return `${prefix}${year}${hash}`;
  };

  return (
    <div className="relative mx-auto w-full max-w-[320px] aspect-[5/8] bg-white rounded-3xl border border-gray-200/80 p-4 md:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between items-center overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-forest-600/30 group select-none shrink-0">
      
      {/* 1. TOP HEADER: LOGO + KARTU TANDA PENGURUS & TOP-RIGHT ROLE */}
      <div className="relative z-10 w-full flex items-center justify-between pb-2 border-b border-gray-100">
        {/* Top Left: JN UKMI Logo & Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/image/logo-jnukmi.svg"
            alt="Logo JN UKMI"
            width={22}
            height={22}
            className="w-5.5 h-5.5 text-forest-600"
          />
          <div className="h-5 w-[2px] bg-forest-600/20" />
          <div className="flex flex-col text-[8px] font-black uppercase text-forest-900 tracking-widest leading-none">
            <span>KARTU TANDA</span>
            <span className="text-forest-600 mt-0.5">PENGURUS</span>
          </div>
        </div>

        {/* Top Right: Short Role Code */}
        <span className="text-[11px] font-black font-mono tracking-widest text-forest-600 uppercase bg-forest-50 px-2 py-0.5 rounded-md border border-forest-100">
          {getShortRole(member.role)}
        </span>
      </div>

      {/* 2. SUBTITLE / TITLE: JN UKMI 26 */}
      <div className="relative z-10 text-center py-0.5">
        <h3 className="text-sm md:text-base font-black font-mono tracking-widest text-forest-900 uppercase">
          JN UKMI 26
        </h3>
      </div>

      {/* 3. CENTER PHOTO FRAME (EXPANDED PHOTO WIDTH WITH MINIMAL SIDE PADDING) */}
      <div className="relative z-10 w-full flex items-center justify-center my-auto">
        {/* Clean Expanded Photo Frame */}
        <div className="relative w-full max-w-[268px] h-48 sm:h-52 md:h-56 bg-gray-50 border-2 border-gray-200/80 rounded-2xl p-1 shadow-sm flex items-center justify-center group-hover:border-forest-600/40 transition-colors">
          {/* Photo Container */}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200/50 flex items-center justify-center">
            {member.foto && member.foto !== "/placeholder.png" && member.foto !== "/public/placeholder.png" ? (
              <Image
                src={member.foto}
                alt={member.nama}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <span className="font-mono text-3xl font-black text-gray-400 tracking-wider">
                {initials(member.nama)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. NAME BADGE (PILL 1) */}
      <div className="relative z-10 w-full max-w-[268px] mb-1.5">
        <div className="py-1.5 px-3 bg-forest-900 text-white rounded-xl text-center shadow-sm">
          <h4 className="text-xs md:text-sm font-black tracking-wide truncate">
            {member.nama}
          </h4>
        </div>
      </div>

      {/* 5. FACULTY ABBREVIATION & NIM BADGE (PILL 2 - EXACT 1 SINGLE LINE FORMAT) */}
      <div className="relative z-10 w-full max-w-[268px] mb-2">
        <div className="py-1.5 px-3 bg-gray-100 border border-gray-200 rounded-xl text-center flex items-center justify-center gap-3">
          <span className="text-[11px] md:text-xs font-black font-mono text-forest-800 tracking-widest uppercase">
            {getFacultyAbbreviation(member.fakultas)}
          </span>
          <span className="text-[11px] md:text-xs font-bold font-mono text-gray-600 tracking-widest uppercase">
            {getNimCode(member.fakultas, member.angkatan, member.nama)}
          </span>
        </div>
      </div>

      {/* 6. ROLE / POSITION CARD BOX (BADGE 3) */}
      <div className="relative z-10 w-full mb-1.5">
        <div className="py-2.5 px-3 bg-gradient-to-r from-forest-800 via-forest-600 to-forest-800 text-white rounded-2xl text-center shadow-sm relative overflow-hidden">
          <p className="text-xs md:text-sm font-black tracking-wider uppercase truncate">
            {member.role}
          </p>
        </div>
      </div>

      {/* 7. FOOTER TEXT: KABINET ISKANDAR MUDA */}
      <div className="relative z-10 w-full text-center pt-1.5 border-t border-gray-100">
        <span className="text-[8.5px] md:text-[9.5px] font-black font-mono text-gray-400 tracking-widest uppercase">
          KABINET ISKANDAR MUDA
        </span>
      </div>

    </div>
  );
}
