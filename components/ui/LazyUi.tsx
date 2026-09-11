"use client";

import dynamic from "next/dynamic";

/* Wrapper client diperlukan karena ssr:false hanya boleh di Client Component,
   sedangkan layout.tsx adalah Server Component. Chunk berat CommandPalette &
   MusicPlayer terpisah dari bundle awal dan baru dimuat di sisi client. */
export const CommandPalette = dynamic(
  () => import("./CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

export const MusicPlayer = dynamic(
  () => import("./MusicPlayer").then((m) => m.MusicPlayer),
  { ssr: false }
);