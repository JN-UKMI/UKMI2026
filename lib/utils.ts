import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PortableTextBlock } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toArabicDigits(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicDigits[parseInt(digit, 10)] || digit)
    .join("");
}

/**
 * Convert Sanity Portable Text array to a basic HTML string.
 * Used as initialContent for NovelEditor when loading older Portable Text articles.
 * Preserves inline marks: bold, italic, underline, links.
 */
export function portableTextToHtml(blocks: PortableTextBlock[]): string {
  if (!Array.isArray(blocks)) return "";

  const result: string[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  function flushList() {
    if (listBuffer.length > 0 && listType) {
      result.push(`<${listType}>\n${listBuffer.join("\n")}\n</${listType}>`);
      listBuffer = [];
      listType = null;
    }
  }

  function buildLinkMap(markDefs: PortableTextBlock["markDefs"]): Record<string, string> {
    const map: Record<string, string> = {};
    if (!Array.isArray(markDefs)) return map;
    for (const def of markDefs) {
      // Standard Sanity annotation: { _key: "...", _type: "link", href: "..." }
      if (def._type === "link" && def._key && def.href) {
        map[def._key] = def.href;
      }
    }
    return map;
  }

  function renderInline(children: NonNullable<PortableTextBlock["children"]>, linkMap: Record<string, string>): string {
    return children
      .map((c) => {
        let text = c.text || "";
        if (c.marks && Array.isArray(c.marks)) {
          for (const mark of c.marks) {
            // Standard decorator marks (strings)
            if (mark === "strong") text = `<strong>${text}</strong>`;
            else if (mark === "em") text = `<em>${text}</em>`;
            else if (mark === "underline") text = `<u>${text}</u>`;
            // Link via markDefs reference: mark is a key pointing to { _type: "link", href: "..." }
            else if (typeof mark === "string" && linkMap[mark]) {
              text = `<a href="${linkMap[mark]}">${text}</a>`;
            }
            // Object-based mark: { _type: "link", href: "..." }
            else if (mark && typeof mark === "object" && mark._type === "link" && mark.href) {
              text = `<a href="${mark.href}">${text}</a>`;
            }
            // Legacy string-based format: "link:https://..."
            else if (typeof mark === "string" && mark.startsWith("link:")) {
              text = `<a href="${mark.slice(5)}">${text}</a>`;
            }
          }
        }
        return text;
      })
      .join("");
  }

  for (const block of blocks) {
    const linkMap = buildLinkMap(block.markDefs);
    const inline = renderInline(block.children || [], linkMap);

    // Handle list items
    if (block.listItem === "bullet") {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listBuffer.push(`<li>${inline}</li>`);
      continue;
    }
    if (block.listItem === "number") {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listBuffer.push(`<li>${inline}</li>`);
      continue;
    }

    // Flush any pending list before a non-list block
    flushList();

    // Handle block types
    if (block.style === "h1") result.push(`<h1>${inline}</h1>`);
    else if (block.style === "h2") result.push(`<h2>${inline}</h2>`);
    else if (block.style === "h3") result.push(`<h3>${inline}</h3>`);
    else if (block.style === "h4") result.push(`<h4>${inline}</h4>`);
    else if (block.style === "blockquote") result.push(`<blockquote><p>${inline}</p></blockquote>`);
    else result.push(`<p>${inline}</p>`);
  }

  // Flush any remaining list
  flushList();

  return result.join("\n");
}
