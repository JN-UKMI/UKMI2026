interface HeroProps {
  tagline: string;
  deskripsi: string;
}

export function Hero({ tagline, deskripsi }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-forest-900 to-forest-800 text-white py-24 px-4 min-h-96">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{tagline}</h1>
        <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto opacity-90">
          {deskripsi}
        </p>
      </div>
    </section>
  );
}
