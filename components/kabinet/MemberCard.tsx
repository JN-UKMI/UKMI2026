"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { MemberCard as MemberCardInterface } from "@/lib/types";

interface MemberCardProps {
  member: MemberCardInterface;
}

export function MemberCard({ member }: MemberCardProps) {
  const shouldReduceMotion = useReducedMotion();
  // Extract role short title for top-right header
  const getShortRole = (role: string) => {
    if (role.includes("Ketua Umum")) return "KETUA";
    if (role.includes("Koordinator")) return "KORWAT";
    if (role.includes("Sekretaris Bidang")) return "SEKBID";
    if (role.includes("Kepala Bidang")) return "KABID";
    if (role.includes("Sekretaris Departemen")) return "SEKDEP";
    if (role.includes("Kepala Departemen")) return "KADEP";
    if (role.includes("Wakil")) return "WAKABID";
    if (role.includes("Sekretaris")) return "SEKRETARIS";
    if (role.includes("Bendahara")) return "BENDAHARA";
    return "PENGURUS";
  };

  // Helper to map full faculty names to short official UNS abbreviations
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

  // Helper to format/get NIM code
  const getNimCode = () => {
    if (member.nim) return member.nim;
    if (member.angkatan && member.angkatan !== "A0000000" && !member.angkatan.startsWith("20")) {
      return member.angkatan;
    }
    return "A0000000";
  };

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="relative mx-auto w-full max-w-[320px] aspect-[5/8] bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-4 md:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between items-center overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-4 hover:border-lime group select-none shrink-0 cursor-pointer"
    >
      {/* 1. TOP HEADER: LOGO + KARTU TANDA PENGURUS & TOP-RIGHT ROLE */}
      <div className="relative z-10 w-full flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        {/* Top Left: JN UKMI Logo & Title */}
        <div className="flex items-center gap-2">
          <Image
            src="/image/logo-jnukmi.svg"
            alt="Logo JN UKMI"
            width={22}
            height={22}
            className="w-5.5 h-5.5 text-forest-600 dark:text-lime"
          />
          <div className="h-5 w-[2px] bg-forest-600/20 dark:bg-lime/30" />
          <div className="flex flex-col text-[8px] font-black uppercase text-forest-900 dark:text-lime tracking-widest leading-none">
            <span>KARTU TANDA</span>
            <span className="text-forest-600 dark:text-lime mt-0.5">PENGURUS</span>
          </div>
        </div>

        {/* Top Right: Short Role Code */}
        <span className="text-[11px] font-black font-mono tracking-widest text-forest-600 dark:text-lime uppercase bg-forest-50 dark:bg-forest-950 px-2 py-0.5 rounded-md border border-forest-100 dark:border-forest-800">
          {getShortRole(member.role)}
        </span>
      </div>

      {/* 2. SUBTITLE / TITLE: JN UKMI 26 */}
      <div className="relative z-10 text-center py-0.5">
        <h3 className="text-sm md:text-base font-black font-mono tracking-widest text-forest-900 dark:text-lime uppercase">
          JN UKMI 26
        </h3>
      </div>

      {/* 3. CENTER PHOTO FRAME */}
      <div className="relative z-10 w-full flex items-center justify-center my-auto">
        <div className="relative w-full max-w-[268px] h-48 sm:h-52 md:h-56 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200/80 dark:border-gray-700 rounded-2xl p-1 shadow-sm flex items-center justify-center group-hover:border-forest-600/40 dark:group-hover:border-lime/40 transition-colors">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 flex items-center justify-center">
            {(() => {
              let photoSrc = member.foto;
              if (
                !photoSrc ||
                photoSrc === "/placeholder.png" ||
                photoSrc === "/public/placeholder.png" ||
                photoSrc === "#"
              ) {
                if (member.jenis_kelamin === "perempuan") {
                  photoSrc = "/image/perempuan.png";
                } else if (member.jenis_kelamin === "laki-laki") {
                  photoSrc = "/image/laki-laki.png";
                } else {
                  const isFemaleRole =
                    member.role?.includes("Akhwat") ||
                    member.role?.includes("Kemuslimahan");

                  photoSrc = isFemaleRole ? "/image/perempuan.png" : "/image/laki-laki.png";
                }
              }

              return (
                <Image
                  src={photoSrc}
                  alt={member.nama}
                  fill
                  sizes="(max-width: 640px) 268px, 320px"
                  loading="lazy"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-108"
                  unoptimized
                />
              );
            })()}
          </div>
        </div>
      </div>

      {/* 4. NAME BADGE (PILL 1) */}
      <div className="relative z-10 w-full max-w-[268px] mb-1.5">
        <div className="py-1.5 px-3 bg-forest-900 dark:bg-forest-950 text-white rounded-xl text-center shadow-sm border border-forest-800 dark:border-forest-700">
          <h4 className="text-xs md:text-sm font-black tracking-wide truncate">
            {member.nama}
          </h4>
        </div>
      </div>

      {/* 5. FACULTY ABBREVIATION & NIM BADGE (PILL 2) */}
      <div className="relative z-10 w-full max-w-[268px] mb-2">
        <div className="py-1.5 px-3 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-center flex items-center justify-center gap-3">
          <span className="text-[11px] md:text-xs font-black font-mono text-forest-800 dark:text-lime tracking-widest uppercase">
            {getFacultyAbbreviation(member.fakultas)}
          </span>
          <span className="text-[11px] md:text-xs font-bold font-mono text-gray-600 dark:text-gray-300 tracking-widest uppercase">
            {getNimCode()}
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
      <div className="relative z-10 w-full text-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
        <span className="text-[8.5px] md:text-[9.5px] font-black font-mono text-gray-400 dark:text-gray-500 tracking-widest uppercase">
          KABINET ISKANDAR MUDA
        </span>
      </div>
    </motion.div>
  );
}
