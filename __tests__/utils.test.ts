import { describe, expect, it } from "vitest";
import { portableTextToHtml, toArabicDigits } from "@/lib/utils";

describe("toArabicDigits", () => {
  it("converts western digits to Arabic-Indic digits", () => {
    expect(toArabicDigits(123)).toBe("١٢٣");
    expect(toArabicDigits(0)).toBe("٠");
    expect(toArabicDigits(2026)).toBe("٢٠٢٦");
  });

  it("leaves non-digit characters untouched", () => {
    expect(toArabicDigits(7)).toBe("٧");
  });
});

describe("portableTextToHtml", () => {
  it("returns empty string for non-array input", () => {
    expect(portableTextToHtml(null as never)).toBe("");
  });

  it("renders paragraphs", () => {
    const html = portableTextToHtml([
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Halo dunia" }] },
    ]);
    expect(html).toBe("<p>Halo dunia</p>");
  });

  it("renders headings and blockquotes", () => {
    const html = portableTextToHtml([
      { _type: "block", style: "h2", children: [{ _type: "span", text: "Judul" }] },
      { _type: "block", style: "blockquote", children: [{ _type: "span", text: "Kutipan" }] },
    ]);
    expect(html).toContain("<h2>Judul</h2>");
    expect(html).toContain("<blockquote><p>Kutipan</p></blockquote>");
  });

  it("renders inline decorators strong/em/underline", () => {
    const html = portableTextToHtml([
      {
        _type: "block",
        style: "normal",
        children: [
          { _type: "span", text: "tebal", marks: ["strong"] },
          { _type: "span", text: "miring", marks: ["em"] },
          { _type: "span", text: "garis", marks: ["underline"] },
        ],
      },
    ]);
    expect(html).toBe("<p><strong>tebal</strong><em>miring</em><u>garis</u></p>");
  });

  it("renders links via standard Sanity markDefs (object annotation)", () => {
    const html = portableTextToHtml([
      {
        _type: "block",
        style: "normal",
        markDefs: [{ _key: "abc", _type: "link", href: "https://example.com" }],
        children: [
          { _type: "span", text: "klik di sini", marks: ["abc"] },
        ],
      },
    ]);
    expect(html).toBe('<p><a href="https://example.com">klik di sini</a></p>');
  });

  it("renders links from object-based inline marks", () => {
    const html = portableTextToHtml([
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "link objek",
            marks: [{ _type: "link", href: "https://example.org" } as never],
          },
        ],
      },
    ]);
    expect(html).toBe('<p><a href="https://example.org">link objek</a></p>');
  });

  it("renders legacy string-based link: marks", () => {
    const html = portableTextToHtml([
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: "legacy", marks: ["link:https://example.net"] }],
      },
    ]);
    expect(html).toBe('<p><a href="https://example.net">legacy</a></p>');
  });

  it("groups consecutive bullet items into a single <ul>", () => {
    const html = portableTextToHtml([
      { _type: "block", style: "normal", listItem: "bullet", children: [{ _type: "span", text: "A" }] },
      { _type: "block", style: "normal", listItem: "bullet", children: [{ _type: "span", text: "B" }] },
      { _type: "block", style: "normal", children: [{ _type: "span", text: "Teks" }] },
    ]);
    expect(html).toBe("<ul>\n<li>A</li>\n<li>B</li>\n</ul>\n<p>Teks</p>");
  });

  it("flushes a pending list before a heading block", () => {
    const html = portableTextToHtml([
      { _type: "block", style: "normal", listItem: "number", children: [{ _type: "span", text: "1" }] },
      { _type: "block", style: "h3", children: [{ _type: "span", text: "Sub" }] },
    ]);
    expect(html).toBe("<ol>\n<li>1</li>\n</ol>\n<h3>Sub</h3>");
  });
});
