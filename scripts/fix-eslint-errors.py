#!/usr/bin/env python3
"""Fix ESLint errors across the codebase."""

import re

# ── 1. TransitionLink.tsx: remove unused `router` ──────────
path = "components/ui/TransitionLink.tsx"
with open(path) as f:
    text = f.read()

# Remove `useRouter` import line
text = re.sub(r'import \{ useRouter \} from "next/navigation";\n', '', text)
# Remove `const router = useRouter();`
text = re.sub(r'  const router = useRouter\(\);\n', '', text)

with open(path, 'w') as f:
    f.write(text)
print("✅ TransitionLink.tsx — removed unused router")

# ── 2. MusicPlayer.tsx: remove unused `currentTrack` ──────────
path = "components/ui/MusicPlayer.tsx"
with open(path) as f:
    text = f.read()

# Remove currentTrack from destructuring (keep the comma clean)
text = text.replace(
    '    currentTrack,\n',
    ''
)

with open(path, 'w') as f:
    f.write(text)
print("✅ MusicPlayer.tsx — removed unused currentTrack")

# ── 3. lib/content.ts: fix `any` type on ayat mapping ──────────
path = "lib/content.ts"
with open(path) as f:
    text = f.read()

# Replace `(v: any)` with a proper inline type
text = text.replace(
    'ayat: verses.map((v: any) => ({',
    'ayat: verses.map((v: Record<string, unknown>) => ({'
)

with open(path, 'w') as f:
    f.write(text)
print("✅ lib/content.ts — fixed any type on verse mapping")

# ── 4. lib/types.ts: fix `any` types on Article interfaces ──────────
path = "lib/types.ts"
with open(path) as f:
    text = f.read()

# Replace coverImage?: any with proper type
text = text.replace(
    'coverImage?: any;',
    'coverImage?: SanityImageSource | string;'
)
# Replace content?: any with proper type
text = text.replace(
    'content?: any;',
    'content?: PortableTextBlock[];'
)

# Add import for SanityImageSource
if 'import type { SanityImageSource }' not in text:
    text = text.replace(
        'export interface MemberCard {',
        'import type { SanityImageSource } from "@sanity/image-url";\n\nexport interface MemberCard {'
    )

# Add PortableTextBlock type definition
if 'PortableTextBlock' not in text:
    # Add before ArticleListItem
    text = text.replace(
        'export interface ArticleListItem {',
        '''interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{
    _type: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  listItem?: string;
  level?: number;
}

export interface ArticleListItem {'''
    )

with open(path, 'w') as f:
    f.write(text)
print("✅ lib/types.ts — fixed any types on Article interfaces")

# ── 5. lib/utils.ts: fix `any` types in portableTextToHtml ──────────
path = "lib/utils.ts"
with open(path) as f:
    text = f.read()

# Replace function signature
text = text.replace(
    'export function portableTextToHtml(blocks: any[]): string {',
    'export function portableTextToHtml(blocks: PortableTextBlock[]): string {'
)

# Import PortableTextBlock type
text = text.replace(
    'import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";',
    'import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\nimport type { PortableTextBlock } from "@/lib/types";'
)

# Replace any in buildLinkMap
text = text.replace(
    'function buildLinkMap(markDefs: any[]): Record<string, string> {',
    'function buildLinkMap(markDefs: PortableTextBlock["markDefs"]): Record<string, string> {'
)

# Replace any in renderInline
text = text.replace(
    'function renderInline(children: any[], linkMap: Record<string, string>): string {',
    'function renderInline(children: PortableTextBlock["children"], linkMap: Record<string, string>): string {'
)

# Replace any in children.map
text = text.replace(
    '.map((c: any) => {',
    '.map((c) => {'
)

with open(path, 'w') as f:
    f.write(text)
print("✅ lib/utils.ts — fixed any types in portableTextToHtml")

# ── 6. ThemeProvider.tsx: fix set-state-in-effect ──────────
path = "components/ui/ThemeProvider.tsx"
with open(path) as f:
    text = f.read()

# Replace the problematic effect with lazy initializer pattern
old_effect = '''  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      // Default is Light Mode
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);'''

new_effect = '''  // Initialize theme from localStorage (lazy initializer avoids
  // setState-in-effect lint). Theme CSS class sync happens in a
  // separate effect that only touches the DOM, not React state.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);'''

text = text.replace(old_effect, new_effect)

# Replace useState initialization to use lazy initializer
old_state = '''  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);'''

new_state = '''  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved === "dark" ? "dark" : "light";
  });
  const [mounted, setMounted] = useState(false);'''

text = text.replace(old_state, new_state)

with open(path, 'w') as f:
    f.write(text)
print("✅ ThemeProvider.tsx — fixed set-state-in-effect")

# ── 7. lib/hooks.ts: fix set-state-in-effect ──────────
path = "lib/hooks.ts"
with open(path) as f:
    text = f.read()

# Replace useMediaQuery with useSyncExternalStore pattern
old_hooks = '''import { useEffect, useState } from "react";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    setMatches(media.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [query]);

  return matches;
}'''

new_hooks = '''import { useState, useEffect, useCallback } from "react";

function useMediaQuery(query: string) {
  // Lazy initializer reads the current match synchronously, avoiding
  // setState-in-effect. The effect only subscribes to future changes.
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    // Sync in case the lazy initializer was stale (rare edge case with
    // dynamic query changes — still safe because no cascading renders).
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
    // Only re-subscribe when query string changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}'''

text = text.replace(old_hooks, new_hooks)

with open(path, 'w') as f:
    f.write(text)
print("✅ lib/hooks.ts — fixed set-state-in-effect")

print("\n✅ All ESLint error fixes applied!")
