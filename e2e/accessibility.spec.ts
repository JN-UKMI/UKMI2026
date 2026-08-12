import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility scan (axe-core) on the most important routes.
 * Fails the test when any serious (critical/serious) violation is found.
 */
const A11Y_ROUTES = ["/", "/artikel", "/tentang", "/kontak"];

for (const path of A11Y_ROUTES) {
  test(`a11y: ${path} tidak punya violation critical/serious`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );

    const summary = serious
      .map((v) => `${v.impact}: ${v.id} (${v.nodes.length}x)`)
      .join("\n");
    expect(summary, `Violation serius di ${path}:\n${summary}`).toBe("");
  });
}
