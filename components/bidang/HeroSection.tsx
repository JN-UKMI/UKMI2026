import Link from "next/link";

interface HeroSectionProps {
  name: string;
  slug: string;
  instagram_url: string;
}

export function HeroSection({ name, instagram_url }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-forest-900 to-forest-600 text-white py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{name}</h1>
        <Link
          href={instagram_url || "#"}
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram ↗
        </Link>
      </div>
    </section>
  );
}
