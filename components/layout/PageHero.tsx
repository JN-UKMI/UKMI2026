import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  badge?: string;
}

export function PageHero({ title, subtitle, badge }: PageHeroProps) {
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
        {badge && (
          <span className="inline-block px-3.5 py-1 mb-3 bg-lime/20 border border-lime/40 text-lime rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            {badge}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-wider uppercase drop-shadow-sm">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm md:text-base text-white/80 mt-3 max-w-2xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Accent Bar */}
        <div className="w-16 h-1 bg-lime rounded-full mt-4 shadow-sm opacity-90" />

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
