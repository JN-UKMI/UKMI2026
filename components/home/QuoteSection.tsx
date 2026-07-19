import { loadQuotes } from "@/lib/content";

export async function QuoteSection() {
  const quotes = await loadQuotes();
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  if (!quote) return null;

  return (
    <section className="relative bg-white">
      <div className="py-16 px-2 sm:px-4">
        <div className="mx-auto bg-gradient-to-r from-forest-800 via-forest-600 to-forest-800 rounded-2xl shadow-xl sm:mx-4 md:mx-8 lg:mx-20 overflow-hidden">
          <div className="p-8 md:p-10 lg:p-12">
            <div className="flex flex-col items-center gap-4 text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl leading-relaxed text-white/90 font-serif" dir="rtl" lang="ar">
                {quote.arabic}
              </p>

              <div className="w-3/4 max-w-xs h-px bg-white/20 my-1" />

              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl">
                &ldquo;{quote.translation}&rdquo;
              </p>

              <p className="text-xs text-lime font-medium tracking-wide">
                {quote.source}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
