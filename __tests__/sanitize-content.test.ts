import { describe, expect, it } from "vitest";
import { sanitizeArticleContent } from "@/lib/sanitize-content";

describe("sanitizeArticleContent", () => {
  it("removes executable HTML and unsafe URLs", () => {
    const result = sanitizeArticleContent(
      '<p onclick="alert(1)">Aman</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>',
    );

    expect(result).toBe('<p>Aman</p><a rel="noopener noreferrer">x</a>');
  });
});
