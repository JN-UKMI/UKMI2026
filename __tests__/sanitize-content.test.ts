import { describe, expect, it } from "vitest";
import { sanitizeArticleContent } from "@/lib/sanitize-content";

describe("sanitizeArticleContent", () => {
  it("removes executable HTML and unsafe URLs", () => {
    const result = sanitizeArticleContent(
      '<p onclick="alert(1)">Aman</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>',
    );

    expect(result).toBe('<p>Aman</p><a rel="noopener noreferrer">x</a>');
  });

  it("strips data: URI from anchor tags but allows data: on img tags", () => {
    const linkResult = sanitizeArticleContent('<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">klik</a>');
    expect(linkResult).toBe('<a rel="noopener noreferrer">klik</a>');

    const imgResult = sanitizeArticleContent('<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="dot" />');
    expect(imgResult).toContain('<img src="data:image/png;base64,');
  });
});
