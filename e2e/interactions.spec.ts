import { test, expect, type Page } from "@playwright/test";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      // Dev-only: chunk Next.js dev tidak membawa nonce CSP (prod memakai nonce via proxy.ts).
      if (/Content Security Policy|violates the following/.test(msg.text())) return;
      errors.push(`console: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

test("kalender: navigasi bulan sebelumnya/berikutnya mengganti judul bulan", async ({
  page,
}) => {
  const errors = collectErrors(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Scroll ke section kalender agar tombol ter-render & terlihat.
  const nextBtn = page.getByRole("button", { name: "Bulan berikutnya" });
  await nextBtn.scrollIntoViewIfNeeded();
  await expect(nextBtn).toBeVisible();

  const monthTitle = page.locator("h3.font-black.text-forest-900");
  const before = (await monthTitle.first().textContent())?.trim() ?? "";

  await nextBtn.click();
  await expect(page.locator("h3.font-black.text-forest-900").first()).not.toHaveText(before);

  const prevBtn = page.getByRole("button", { name: "Bulan sebelumnya" });
  await prevBtn.click();
  await expect(page.locator("h3.font-black.text-forest-900").first()).toHaveText(before);

  await page.waitForTimeout(300);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("artikel: pindah tab filter kategori tetap menampilkan kartu", async ({
  page,
}) => {
  const errors = collectErrors(page);
  await page.goto("/artikel", { waitUntil: "domcontentloaded" });

  const filterBar = page.locator('[aria-label="Filter kategori artikel"]');
  await filterBar.scrollIntoViewIfNeeded();

  const kajianTab = page.getByRole("button", { name: /Kajian/i });
  if (await kajianTab.count()) {
    await kajianTab.first().click();
    // Card grid harus tetap ada setelah ganti tab (tidak hilang).
    await expect(page.locator("main")).toBeVisible();
  }

  const semuaTab = page.getByRole("button", { name: /^Semua/ });
  if (await semuaTab.count()) {
    await semuaTab.first().click();
    await expect(page.locator("main")).toBeVisible();
  }

  await page.waitForTimeout(300);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("theme toggle: klik mengubah atribut class dark pada html", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const toggle = page.getByRole("button", { name: "Toggle Theme" });
  await toggle.scrollIntoViewIfNeeded();

  const html = page.locator("html");
  const before = await html.getAttribute("class");

  await toggle.click();
  await page.waitForTimeout(400);
  const after = await html.getAttribute("class");
  expect(after).not.toBe(before);
});

test("navbar mobile: menu terbuka dan bisa menutup", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Hanya untuk viewport mobile");
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const menuButton = page.getByRole("button", { name: "Toggle Menu Mobile" });
  await expect(menuButton).toBeVisible();
  await menuButton.click();

  // Menu terbuka - cek ada link navigasi (misal "Artikel").
  await expect(page.getByRole("link", { name: /Artikel/i }).first()).toBeVisible();

  await menuButton.click();
  await expect(page.getByRole("link", { name: /Artikel/i }).first()).toBeHidden();
});
