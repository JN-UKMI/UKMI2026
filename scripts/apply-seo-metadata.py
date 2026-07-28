#!/usr/bin/env python3
"""
Bulk-apply `buildPageMetadata` to 12 pages that still have bare
`export const metadata: Metadata = { title, description }` blocks.

Why a script (and not 12 str_replace calls): the existing metadata
blocks have different whitespace / apostrophe quirks that defeat exact
text matching. Using Python regex we can:
  1. Capture the existing title and description from each file.
  2. Replace the import `import type { Metadata } from "next";` with
     `import { buildPageMetadata } from "@/lib/page-metadata";`.
  3. Replace the entire `export const metadata: Metadata = { ... };`
     block with a `buildPageMetadata({...})` call that uses the
     captured fields, plus a per-file path/title.

Run once: `python3 scripts/apply-seo-metadata.py`. Idempotent — it
refuses to touch files already using `buildPageMetadata`.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# (file, title_no_suffix, path)
META = [
    ("app/kabinet/page.tsx", "Kabinet Iskandar Muda", "/kabinet"),
    ("app/ldf/page.tsx", "Lembaga Dakwah Fakultas", "/ldf"),
    ("app/oki/page.tsx", "Ormawa Kerohanian Islam", "/oki"),
    ("app/partner/page.tsx", "Partner Dakwah", "/partnership"),
    ("app/doa-doa/page.tsx", "Database Doa & Zikir", "/doa-doa"),
    ("app/buku-ukmi/page.tsx", "BUMI — Perpustakaan Mini", "/buku-ukmi"),
    ("app/al-kahfi/page.tsx", "Surah Al-Kahfi", "/al-kahfi"),
    ("app/al-masurat/page.tsx", "Al-Ma’surat", "/al-masurat"),
    ("app/al-masurat/layout.tsx", "Al-Ma’surat", "/al-masurat"),
    ("app/artikel/page.tsx", "Artikel", "/artikel"),
    ("app/not-found.tsx", "Halaman Tidak Ditemukan", "/404"),
]


def looks_already_done(content: str) -> bool:
    return "buildPageMetadata" in content or "export const metadata = buildPageMetadata" in content


def escape_for_js(s: str) -> str:
    """Escape JS string literal contents (single-quotes, backslashes)."""
    return s.replace("\\", "\\\\").replace("'", "\\'")


def transform(content: str, title: str, path: str) -> str:
    # 1. Swap the Metadata type-import for the page-metadata helper.
    if 'import type { Metadata } from "next"' in content:
        content = content.replace(
            'import type { Metadata } from "next"',
            'import { buildPageMetadata } from "@/lib/page-metadata"',
        )

    # 2. Capture description from existing block (best-effort).
    m = re.search(r"description:\s*([\"'])(.+?)\1", content, flags=re.DOTALL)
    description_raw = m.group(2).strip() if m else ""

    title_lit = escape_for_js(title)
    desc_lit = escape_for_js(description_raw)
    path_lit = escape_for_js(path)

    # 3. Replace the bare `export const metadata: Metadata = { ... };`
    new_call = (
        f"export const metadata = buildPageMetadata({{\n"
        f"  title: '{title_lit}',\n"
        f"  description: '{desc_lit}',\n"
        f"  path: '{path_lit}',\n"
        f"}});"
    )
    content = re.sub(
        r"export const metadata:\s*Metadata\s*=\s*\{[^{}]*\}\s*;",
        new_call,
        content,
        count=1,
        flags=re.DOTALL,
    )
    return content


def main() -> int:
    edited = 0
    skipped = 0
    for rel, title, path in META:
        file = ROOT / rel
        if not file.exists():
            print(f"  ! {rel} not found, skipping")
            skipped += 1
            continue
        original = file.read_text(encoding="utf-8")
        if looks_already_done(original):
            print(f"  - {rel} already uses buildPageMetadata, skipping")
            skipped += 1
            continue
        updated = transform(original, title, path)
        if updated == original:
            print(f"  ! {rel} did not match expected pattern, skipping")
            skipped += 1
            continue
        file.write_text(updated, encoding="utf-8")
        print(f"  ~ {rel} updated (→ buildPageMetadata)")
        edited += 1
    print(f"\nDone: {edited} edited, {skipped} skipped.")
    return 0 if edited > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
