#!/usr/bin/env python3
"""
Fix-up for the bulk SEO pass: ensure every page that calls
`buildPageMetadata(...)` also has `import { buildPageMetadata } from "@/lib/page-metadata";`
at the top.

Strategy:
- For each candidate file, find the first `import` line in source order.
- Insert the buildPageMetadata import IMMEDIATELY AFTER it (sorted-insertions
  preserve alphabetical convention when imports are already sorted).
- Idempotent: skips files that already have the helper imported.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# All pages that may need the import — covers home, all bulk-replaced
# pages, and the ones we'll touch in this turn.
PAGES = [
    "app/page.tsx",
    "app/tentang/page.tsx",
    "app/kabinet/page.tsx",
    "app/ldf/page.tsx",
    "app/oki/page.tsx",
    "app/partner/page.tsx",
    "app/doa-doa/page.tsx",
    "app/buku-ukmi/page.tsx",
    "app/al-kahfi/page.tsx",
    "app/al-masurat/page.tsx",
    "app/al-masurat/layout.tsx",
    "app/artikel/page.tsx",
    "app/not-found.tsx",
    "app/artikel/[slug]/page.tsx",
    "app/bidang/[slug]/page.tsx",
]

# Idempotent: skip if a `Metadata` type import is still present.
# Old imports look like `import type { Metadata } from "next";` or
# `import { type Metadata } from "next";` — we remove them in favour of
# the helper-only import.
OLD = re.compile(r'import\s+\{[^}]*\bMetadata\b[^}]*\}\s+from\s+"next";?\s*\n')
HELPER = 'import { buildPageMetadata } from "@/lib/page-metadata";\n'


def fix(content: str) -> str:
    if "buildPageMetadata" in content and 'from "@/lib/page-metadata"' in content:
        return content  # already wired
    # Remove obsolete Metadata-type imports if any.
    content = OLD.sub("", content)
    # Insert helper import after the LAST existing import line (preserve grouping).
    lines = content.splitlines(keepends=True)
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith("import ") and (";" in line or "from" in line):
            last_import_idx = i
    if last_import_idx == -1:
        # No imports at all — insert at top, after any "use client" directive.
        directive_idx = -1
        for i, line in enumerate(lines):
            if line.startswith('"use client"') or line.startswith("'use client'"):
                directive_idx = i
            break_was_used = True
        insert_at = directive_idx + 1 if directive_idx >= 0 else 0
        lines.insert(insert_at, HELPER)
    else:
        lines.insert(last_import_idx + 1, HELPER)
    return "".join(lines)


def main() -> int:
    edited = 0
    for rel in PAGES:
        file = ROOT / rel
        if not file.exists():
            print(f"  ! {rel} not found, skipping")
            continue
        original = file.read_text(encoding="utf-8")
        updated = fix(original)
        if updated == original:
            print(f"  - {rel} already wired, skipping")
            continue
        file.write_text(updated, encoding="utf-8")
        print(f"  ~ {rel} imported buildPageMetadata")
        edited += 1
    print(f"\nDone: {edited} files updated.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
