import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-screen -mt-[80px] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal green-black overlay 80% */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-[80px] text-center text-white -mt-16">
        <p className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
          Jamaah Nurul Huda
        </p>
        <p className="text-4xl font-bold leading-tight md:text-6xl lg:text-7xl mt-2">
          Unit Kegiatan Mahasiswa Islam
        </p>
        <Link
          href="https://uns.ac.id"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-8 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/20 hover:border-white/50"
        >
          Universitas Sebelas Maret
        </Link>
        <Image
          src="/image/logo-jnukmi.svg"
          alt="JN UKMI Logo"
          width={48}
          height={48}
          className="mt-8 h-auto w-10 md:w-12 opacity-60"
          priority
        />
      </div>
    </section>
  );
}
