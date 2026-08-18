import { createSuggestionItems, type SuggestionItem } from "novel";
import { uploadImageToSanity } from "./extensions";

export const suggestionItems: SuggestionItem[] = createSuggestionItems([
  {
    title: "Heading 1",
    description: "Judul besar - gunakan di awal section",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M4 4v16M8 10h8M8 4v16M17.5 4v8a4 4 0 0 1-4 4h-1" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    },
    searchTerms: ["judul", "h1", "heading", "besar", "title", "header"],
  },
  {
    title: "Heading 2",
    description: "Judul sedang - sub-section utama",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M4 4v16h8M6 10h4M17.5 4v8a4 4 0 0 1-4 4h-1M13 12h4" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    },
    searchTerms: ["subtitle", "h2", "heading", "sedang", "medium", "sub"],
  },
  {
    title: "Heading 3",
    description: "Judul kecil - sub-bagian dari H2",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M4 4v16M8 10h8M8 4v16M17.5 4v8a4 4 0 0 1-4 4h-1M13 12h4M13 16h4" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    },
    searchTerms: ["small", "h3", "heading", "kecil", "mini"],
  },
  {
    title: "Bullet List",
    description: "Daftar poin tidak berurutan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
    searchTerms: ["list", "bullet", "poin", "unordered", "daftar"],
  },
  {
    title: "Numbered List",
    description: "Daftar berurutan (1, 2, 3...)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M10 6h11M10 12h11M10 18h11M4 5l2 1V4M4 11h2l-2 2M4 17l2 2-2 0" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
    searchTerms: ["list", "number", "ordered", "angka", "nomor", "enum"],
  },
  {
    title: "Blockquote",
    description: "Kutipan atau cuplikan teks",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
    searchTerms: ["quote", "kutipan", "blockquote", "catatan", "citation"],
  },
  {
    title: "Code Block",
    description: "Blok kode dengan highlight",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
    searchTerms: ["code", "kode", "snippet", "program", "script"],
  },
  {
    title: "Divider",
    description: "Garis pemisah horizontal",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <path d="M5 12h14" />
      </svg>
    ),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
    searchTerms: ["divider", "garis", "pemisah", "hr", "separator", "line"],
  },
  {
    title: "Image",
    description: "Sisipkan gambar ke artikel",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-forest-700">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    command: async ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // Trigger file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            const url = await uploadImageToSanity(file);
            editor.chain().focus().setImage({ src: url, alt: file.name }).run();
          } catch (err) {
            console.error("Gagal mengunggah gambar:", err);
          }
        }
      };
      input.click();
    },
    searchTerms: ["image", "gambar", "photo", "foto", "picture", "upload", "media"],
  },
]);
