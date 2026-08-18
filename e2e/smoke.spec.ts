import { test, expect, type Page } from "@playwright/test";

/**
 * Collect console errors + uncaught page errors and fail the test if any
 * appear. This catches hydration mismatches and runtime crashes across all
 * routes automatically.
 */
function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // Abaikan 404 resource (mis. favicon) - bukan runtime bug.
    if (/Failed to load resource: the server responded with a status of 404/.test(msg.text())) return;
    // Dev-only: chunk Next.js dev tidak membawa nonce CSP (prod memakai nonce via proxy.ts).
    if (/Content Security Policy|violates the following/.test(msg.text())) return;
    errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

/** Routes that must render the main content area successfully. */
const PUBLIC_ROUTES: { path: string; hint: RegExp }[] = [
  { path: "/", hint: /JN UKMI|Event Terdekat|Kalender/i },
  { path: "/artikel", hint: /Artikel/i },
  { path: "/tentang", hint: /Tentang|Perkenalan/i },
  { path: "/kabinet", hint: /Kabinet|Pengurus/i },
  { path: "/al-matsurat", hint: /Al-Ma.?.tsurat/i },
  { path: "/doa-doa", hint: /Doa/i },
  { path: "/al-kahfi", hint: /Al-Kahf/i },
  { path: "/bidang/syiar", hint: /Syiar/i },
  { path: "/partner", hint: /Partner/i },
  { path: "/ldf", hint: /Lembaga Dakwah|Dakwah Fakultas/i },
  { path: "/oki", hint: /OKI/i },
  { path: "/buku-ukmi", hint: /Buku|BUMI/i },
  { path: "/ukmi-store", hint: /Sewa|Store/i },
  { path: "/kontak", hint: /Kontak/i },
  { path: "/login", hint: /Masuk|Login/i },
];

for (const { path, hint } of PUBLIC_ROUTES) {
  test(`route ${path} renders without errors`, async ({ page }) => {
    const errors = collectErrors(page);
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });

    expect(response?.ok(), `GET ${path} should be 2xx`).toBeTruthy();
    await expect(page.locator("#main-content")).toBeVisible();

    // Content hint - at least one matching text node must exist.
    await expect(page.locator("body")).toContainText(hint);

    // Give client-side hydration a moment, then assert no errors.
    await page.waitForTimeout(400);
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("admin route redirects to login when unauthenticated", async ({ page }) => {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login/);
});

test("404 page renders for unknown route", async ({ page }) => {
  const errors = collectErrors(page);
  const response = await page.goto("/halaman-tidak-ada-xyz", {
    waitUntil: "domcontentloaded",
  });
  expect(response?.status()).toBe(404);
  await expect(page.locator("body")).toContainText(/404|tidak ditemukan|Not Found/i);
  await page.waitForTimeout(400);
  expect(errors, errors.join("\n")).toEqual([]);
});
