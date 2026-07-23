import { loadQuotes } from "@/lib/content";
import { QuoteClient } from "./QuoteClient";

export async function QuoteSection() {
  const quotes = await loadQuotes();
  if (!quotes || quotes.length === 0) return null;

  return <QuoteClient quotes={quotes} />;
}
