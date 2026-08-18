import {
  StarterKit,
  TiptapUnderline,
  TiptapLink,
  Placeholder,
  UpdatedImage,
  CustomKeymap,
  TaskList,
  TaskItem,
  Command,
  renderItems,
} from "novel";
import { cx } from "class-variance-authority";
import { suggestionItems } from "./slash-commands";

// ── Image Upload Handler ──────────────────────────────────────
// Shared between NovelEditor drag/drop/paste and slash command
let globalUploadFn: ((file: File) => Promise<string>) | null = null;

export function setImageUploadHandler(fn: (file: File) => Promise<string>) {
  globalUploadFn = fn;
}

export async function uploadImageToSanity(file: File): Promise<string> {
  if (globalUploadFn) {
    return globalUploadFn(file);
  }
  // Fallback: base64 data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
}

// ── Block Exit Key Handler ────────────────────────────────────
// State for tracking double-Enter in code blocks
export const blockExitState = {
  lastEnterBlock: "",
  lastEnterTime: 0,
};

export const defaultExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4] },
    bulletList: {
      HTMLAttributes: { class: cx("list-disc list-outside ml-4") },
    },
    orderedList: {
      HTMLAttributes: { class: cx("list-decimal list-outside ml-4") },
    },
    blockquote: {
      HTMLAttributes: {
        class: cx(
          "border-l-[3px] border-forest-600 dark:border-forest-400 pl-4 py-2 my-4 bg-forest-50/30 dark:bg-forest-950/30 rounded-r-lg italic text-gray-600 dark:text-gray-300"
        ),
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: cx(
          "rounded-xl bg-[#1F2937] dark:bg-[#0F172A] text-gray-100 p-5 font-mono text-sm overflow-x-auto my-4 shadow-sm"
        ),
      },
    },
    code: {
      HTMLAttributes: {
        class: cx(
          "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-forest-700 dark:text-forest-300 before:content-none after:content-none"
        ),
        spellcheck: "false",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: cx("border-gray-200"),
      },
    },
    dropcursor: {
      color: "#255f38",
      width: 4,
    },
    // gapcursor enabled by default - allows clicking below block elements
    // (code blocks, blockquotes, etc.) to insert new paragraphs
  }),
  TiptapUnderline,
  TiptapLink.configure({
    openOnClick: false,
    HTMLAttributes: {
      class:
        "text-forest-600 underline font-medium hover:text-forest-800 decoration-forest-400 underline-offset-2 transition-colors",
    },
  }),
  UpdatedImage.configure({
    HTMLAttributes: {
      class: cx("rounded-lg max-w-full my-4"),
    },
    allowBase64: true,
    inline: false,
  }),
  CustomKeymap,
  TaskList.configure({
    HTMLAttributes: { class: cx("not-prose pl-0") },
  }),
  TaskItem.configure({
    HTMLAttributes: { class: cx("flex items-start gap-2 my-1") },
    nested: true,
  }),
  Command.configure({
    suggestion: {
      items: ({ query }: { query: string }) => {
        return suggestionItems
          .filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 10);
      },
      render: renderItems,
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading" && node.attrs.level === 1)
        return "Judul besar...";
      if (node.type.name === "heading" && node.attrs.level === 2)
        return "Judul sedang...";
      if (node.type.name === "heading" && node.attrs.level === 3)
        return "Judul kecil...";
      return "Ketik '/' untuk perintah, atau mulai menulis...";
    },
    showOnlyWhenEditable: true,
    showOnlyCurrent: true,
    includeChildren: false,
  }),
];
