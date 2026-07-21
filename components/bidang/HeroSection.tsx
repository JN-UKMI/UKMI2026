import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  name: string;
  slug: string;
  instagram_url: string;
}

export function HeroSection({ name, instagram_url }: HeroSectionProps) {
  return (
    <section className="relative min-h-[320px] md:min-h-[380px] -mt-[80px] overflow-hidden flex items-center justify-center py-16 px-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal green-black overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/90 via-forest-900/85 to-black/90" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white max-w-4xl mx-auto pt-[60px]">
        <span className="inline-block px-3.5 py-1 mb-3 bg-lime/20 border border-lime/40 text-lime rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
          Bidang JN UKMI
        </span>

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase drop-shadow-sm mb-4">
          {name}
        </h1>

        <Link
          href={instagram_url || "#"}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-full font-bold transition-all text-xs shadow-md active:scale-95 mb-4"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kunjungi Instagram ↗
        </Link>

        {/* Accent Bar */}
        <div className="w-16 h-1 bg-lime rounded-full shadow-sm opacity-90" />

        <Image
          src="/image/logo-jnukmi.svg"
          alt="JN UKMI Logo"
          width={40}
          height={40}
          className="mt-6 h-auto w-8 md:w-9 opacity-40"
          priority
        />
      </div>
    </section>
  );
}
