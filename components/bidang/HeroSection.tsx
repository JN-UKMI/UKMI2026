import Link from "next/link";

interface HeroSectionProps {
  name: string;
  slug: string;
  instagram_url: string;
}

import Image from "next/image";

export function HeroSection({ name, instagram_url }: HeroSectionProps) {
  return (
    <section className="relative min-h-[100dvh] -mt-[80px] overflow-hidden flex items-center justify-center py-20 px-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white pt-[80px] max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
          {name}
        </h1>
        <div className="flex flex-col items-center gap-4">
          <Link
            href={instagram_url || "#"}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors text-sm shadow-md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kunjungi Instagram ↗
          </Link>
          <Image
            src="/image/logo-jnukmi.svg"
            alt="JN UKMI Logo"
            width={40}
            height={40}
            className="mt-4 h-auto w-8 md:w-9 opacity-40"
            priority
          />
        </div>
      </div>
    </section>
  );
}
