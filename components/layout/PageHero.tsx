import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative min-h-[300px] md:min-h-[360px] -mt-[80px] overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/image/ukmi-hero.jpg)" }}
      />

      {/* Diagonal green-black overlay 80% */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-forest-900/80 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-[80px] text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-base text-white/80 mt-3 max-w-2xl mx-auto font-medium">
            {subtitle}
          </p>
        )}
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
