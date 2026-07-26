"use client";

import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
  useEditor,
  handleCommandNavigation,
  type JSONContent,
  type EditorInstance,
} from "novel";
import { useState, useEffect, useCallback } from "react";
import { defaultExtensions, setImageUploadHandler, uploadImageToSanity } from "./extensions";
import { suggestionItems } from "./slash-commands";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  ImageIcon,
  Link2,
} from "lucide-react";

interface NovelEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  /**
   * Optional image upload function.
   * Receives a File, uploads to server/Sanity, returns the public URL.
   * If not provided, falls back to /api/upload.
   */
  uploadFn?: (file: File) => Promise<string>;
}

// ── Toolbar Button ───────────────────────────────────────────
function ToolbarButton({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition text-sm flex items-center justify-center cursor-pointer ${
        isActive
          ? "bg-forest-100 text-forest-800 shadow-sm border border-forest-200"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-transparent"
      }`}
    >
      {children}
    </button>
  );
}

// ── Toolbar Divider ──────────────────────────────────────────
function ToolbarDivider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />;
}

// ── Top Toolbar ──────────────────────────────────────────────
function EditorToolbar({ editor }: { editor: EditorInstance | null }) {
  if (!editor) return null;

  // ── Image upload handler (from slash command too) ──────
  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const url = await uploadImageToSanity(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (err) {
        console.error("Gagal mengunggah gambar:", err);
      }
    };
    input.click();
  }, [editor]);

  // ── Link handler ──────────────────────────────────────
  const handleLink = useCallback(() => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("Masukkan URL:", "https://");
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  return (
    <div className="bg-gray-50/90 border-b border-gray-200 px-3 py-2 flex flex-wrap items-center gap-0.5 sticky top-0 z-10 rounded-t-2xl">
      {/* Group 1: Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Tebal (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Miring (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Garis Bawah (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Coret"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Kode Inline"
      >
        <Code2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 2: Headings */}
      <ToolbarButton
        onClick={() =>
          editor.isActive("heading", { level: 1 })
            ? editor.chain().focus().setParagraph().run()
            : editor.chain().focus().setNode("heading", { level: 1 }).run()
        }
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.isActive("heading", { level: 2 })
            ? editor.chain().focus().setParagraph().run()
            : editor.chain().focus().setNode("heading", { level: 2 }).run()
        }
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() =>
          editor.isActive("heading", { level: 3 })
            ? editor.chain().focus().setParagraph().run()
            : editor.chain().focus().setNode("heading", { level: 3 }).run()
        }
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 3: Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Daftar Poin"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Daftar Nomor"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive("taskList")}
        title="Daftar Tugas"
      >
        <CheckSquare className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 4: Blocks */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Kutipan"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Blok Kode"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        title="Garis Pemisah"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Group 5: Media & Links */}
      <ToolbarButton
        onClick={handleLink}
        isActive={editor.isActive("link")}
        title={editor.isActive("link") ? "Hapus Tautan" : "Tautan"}
      >
        <Link2 className="w-4 h-4" />
      </ToolbarButton>

      <ToolbarButton
        onClick={handleImageUpload}
        isActive={false}
        title="Sisipkan Gambar"
      >
        <ImageIcon className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
}

// ── Bubble Menu ──────────────────────────────────────────────
function BubbleMenuContent() {
  const { editor } = useEditor();
  if (!editor) return null;

  const headingLevel = editor.isActive("heading")
    ? editor.getAttributes("heading").level
    : 0;

  return (
    <>
      {/* Heading Level Selector */}
      <div className="flex items-center gap-0.5">
        <select
          value={headingLevel || "p"}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "p") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .setNode("heading", { level: Number(val) })
                .run();
            }
          }}
          className="h-8 rounded-md border-0 bg-transparent px-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-600/20"
          title="Heading level"
        >
          <option value="p">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
        </select>
        <div className="mx-1 h-5 w-px bg-gray-200" />
      </div>

      {/* Bold */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleBold().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md text-sm font-bold transition-colors ${
            editor.isActive("bold")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
      </EditorBubbleItem>

      {/* Italic */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleItalic().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
            editor.isActive("italic")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
      </EditorBubbleItem>

      {/* Underline */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleUnderline().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
            editor.isActive("underline")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </EditorBubbleItem>

      {/* Strikethrough */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleStrike().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
            editor.isActive("strike")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </EditorBubbleItem>

      {/* Separator */}
      <div className="mx-1 h-5 w-px bg-gray-200" />

      {/* Inline Code */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleCode().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md text-xs font-mono font-bold transition-colors ${
            editor.isActive("code")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title="Inline Code"
        >
          <Code2 className="w-4 h-4" />
        </button>
      </EditorBubbleItem>

      {/* Link */}
      <EditorBubbleItem
        onSelect={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
          } else {
            const url = window.prompt("Masukkan URL:", "https://");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }
        }}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
            editor.isActive("link")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          title={editor.isActive("link") ? "Remove Link" : "Add Link"}
        >
          <Link2 className="w-4 h-4" />
        </button>
      </EditorBubbleItem>
    </>
  );
}

// ── Slash Command Menu ───────────────────────────────────────
function SlashCommandContent() {
  const { editor } = useEditor();
  if (!editor) return null;

  return (
    <EditorCommand className="z-50 h-auto max-h-[360px] w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 slide-in-from-top-1 duration-150">
      <EditorCommandEmpty className="px-3 py-3 text-sm text-gray-400 text-center">
        <span className="block text-lg mb-1">🔍</span>
        Tidak ada hasil untuk perintah ini
      </EditorCommandEmpty>
      <EditorCommandList>
        {suggestionItems.map((item) => (
          <EditorCommandItem
            key={item.title}
            value={item.title}
            onCommand={(val) => item.command?.(val)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all aria-selected:bg-forest-50 aria-selected:text-forest-900 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600 shadow-sm">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-[13px]">
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          </EditorCommandItem>
        ))}
      </EditorCommandList>
    </EditorCommand>
  );
}

// ── Main Editor Component ────────────────────────────────────
export default function NovelEditor({
  initialContent,
  onChange,
  uploadFn,
}: NovelEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(
    null
  );

  // Register custom upload handler
  const defaultUpload = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Gagal mengunggah gambar");
    }
    const data = await res.json();
    return data.url;
  }, []);

  useEffect(() => {
    setImageUploadHandler(uploadFn || defaultUpload);
  }, [uploadFn, defaultUpload]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Sanitise HTML content (strip inline colour/font styles) ──
  const sanitizeContent = useCallback((html: string) => {
    return html
      .replace(/<font[^>]*>/gi, "")
      .replace(/<\/font>/gi, "")
      .replace(/<span[^>]*>/gi, "")
      .replace(/<\/span>/gi, "")
      .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
      .replace(/\sstyle\s*=\s*'[^']*'/gi, "");
  }, []);

  // Sync external content changes
  useEffect(() => {
    if (!editorInstance || !initialContent) return;
    const sanitized = sanitizeContent(initialContent);
    const currentContent = editorInstance.getHTML();
    if (currentContent !== sanitized) {
      editorInstance.commands.setContent(sanitized, false);
    }
  }, [editorInstance, initialContent, sanitizeContent]);

  const handleUpdate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      onChange(editor.getHTML());
    },
    [onChange]
  );

  // ── Image Drag & Drop / Paste Handler ────────────────────
  const handleCreate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      setEditorInstance(editor);

      // Handle image drag & drop
      editor.view.dom.addEventListener("drop", async (event: DragEvent) => {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) return;
        event.preventDefault();

        try {
          const url = await uploadImageToSanity(file);
          editor
            .chain()
            .focus()
            .setImage({ src: url, alt: file.name })
            .run();
        } catch (err) {
          console.error("Gagal mengunggah gambar (drop):", err);
        }
      });

      // Handle image paste from clipboard
      editor.view.dom.addEventListener(
        "paste",
        async (event: ClipboardEvent) => {
          const items = event.clipboardData?.items;
          if (!items) return;
          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (file) {
                try {
                  const url = await uploadImageToSanity(file);
                  editor
                    .chain()
                    .focus()
                    .setImage({ src: url, alt: file.name })
                    .run();
                } catch (err) {
                  console.error("Gagal mengunggah gambar (paste):", err);
                }
              }
              break;
            }
          }
        }
      );
    },
    []
  );

  if (!mounted) {
    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-transparent animate-spin" />
          <span className="text-sm">Memuat editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full editor-container">
      <EditorRoot>
        {/* Top Toolbar */}
        <EditorToolbar editor={editorInstance} />

        <EditorContent
          extensions={defaultExtensions}
          initialContent={(initialContent as unknown as JSONContent) || undefined}
          className="novel-editor-wrapper"
          onUpdate={handleUpdate}
          onCreate={handleCreate}
          immediatelyRender={false}
          editorProps={{
            attributes: {
              class:
                "prose prose-lg focus:outline-none max-w-none min-h-[500px] px-8 py-8",
            },
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event as KeyboardEvent),
            },
            transformPastedHTML(html) {
              // Strip all colour/font styling from pasted HTML so text always
              // inherits the editor's default colours.
              return html
                // Strip <font> tags completely
                .replace(/<font[^>]*>/gi, "")
                .replace(/<\/font>/gi, "")
                // Strip ALL <span> tags (they are purely style wrappers in pasted content)
                .replace(/<span[^>]*>/gi, "")
                .replace(/<\/span>/gi, "")
                // Strip inline style attributes entirely
                .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
                .replace(/\sstyle\s*=\s*'[^']*'/gi, "")
                // Belt-and-suspenders: strip any colour declarations that may
                // have been injected by other means (e.g. a rich-text source)
                .replace(/color\s*:\s*[^;"'>]+;?/gi, "")
                .replace(/background\s*:\s*[^;"'>]+;?/gi, "")
                .replace(/background-color\s*:\s*[^;"'>]+;?/gi, "");
            },
          }}
        >
          <SlashCommandContent />

          {/* Floating bubble menu on text selection */}
          <EditorBubble
            tippyOptions={{
              placement: "top",
              maxWidth: 600,
            }}
            className="flex items-center gap-0.5 rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-xl shadow-black/5"
          >
            <BubbleMenuContent />
          </EditorBubble>
        </EditorContent>
      </EditorRoot>

      <style jsx global>{`
        /* ── Editor Container ── */
        .editor-container {
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          overflow: hidden;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s, box-shadow 0.2s;
        }
        .editor-container:focus-within {
          border-color: #255f38;
          box-shadow: 0 0 0 3px rgba(37, 95, 56, 0.08);
        }

        /* ── Editor Wrapper ── */
        .novel-editor-wrapper {
          min-height: 500px;
        }

        /* ── ProseMirror Editor Area ── */
        .novel-editor-wrapper .ProseMirror {
          min-height: 500px;
          padding: 2rem 2.5rem;
          outline: none;
          caret-color: #255f38;
        }
        .novel-editor-wrapper .ProseMirror:focus {
          outline: none;
        }

        /* ── Placeholder ── */
        .novel-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
          font-weight: 400;
        }

        /* ── Headings ── */
        .novel-editor-wrapper .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.025em;
          margin: 1.75rem 0 0.75rem;
          color: #111827;
        }
        .novel-editor-wrapper .ProseMirror h2 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -0.02em;
          margin: 1.75rem 0 0.5rem;
          color: #111827;
        }
        .novel-editor-wrapper .ProseMirror h3 {
          font-size: 1.375rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 1.5rem 0 0.5rem;
          color: #111827;
        }
        .novel-editor-wrapper .ProseMirror h4 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 1.25rem 0 0.5rem;
          color: #111827;
        }

        /* ── Paragraphs ── */
        .novel-editor-wrapper .ProseMirror p {
          margin: 0.75em 0;
          line-height: 1.8;
          font-size: 1.0625rem;
          color: #374151;
        }

        /* ── Text Formatting ── */
        /* Elements with inline style attributes get forced to inherit colour
           as a visual safeguard for any styling that sneaks past the
           transformPastedHTML/sanitizeContent sanitisation. */
        .novel-editor-wrapper .ProseMirror [style] {
          color: inherit !important;
          background-color: transparent !important;
        }
        .novel-editor-wrapper .ProseMirror strong {
          font-weight: 700;
          color: #111827;
        }
        .novel-editor-wrapper .ProseMirror em {
          font-style: italic;
        }
        .novel-editor-wrapper .ProseMirror u {
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .novel-editor-wrapper .ProseMirror s {
          text-decoration: line-through;
        }
        .novel-editor-wrapper .ProseMirror code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: ui-monospace, monospace;
          color: #166534;
          font-weight: 500;
          &::before,
          &::after {
            content: none;
          }
        }

        /* ── Lists ── */
        .novel-editor-wrapper .ProseMirror ul,
        .novel-editor-wrapper .ProseMirror ol {
          margin: 0.75em 0;
          padding-left: 1.5em;
        }
        .novel-editor-wrapper .ProseMirror li {
          margin: 0.3em 0;
          line-height: 1.8;
        }
        .novel-editor-wrapper .ProseMirror ul li {
          &::marker {
            color: #255f38;
          }
        }

        /* ── Quotes ── */
        .novel-editor-wrapper .ProseMirror blockquote {
          border-left: 3px solid #255f38;
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #4b5563;
          background: #fafcf9;
          border-radius: 0 0.75rem 0.75rem 0;
        }

        /* ── Links ── */
        .novel-editor-wrapper .ProseMirror a {
          color: #255f38;
          text-decoration: underline;
          text-underline-offset: 2px;
          font-weight: 500;
          transition: color 0.15s;
          cursor: pointer;
        }
        .novel-editor-wrapper .ProseMirror a:hover {
          color: #1f7d53;
        }

        /* ── Horizontal Rule ── */
        .novel-editor-wrapper .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2.5rem 0;
        }

        /* ── Code Block ── */
        .novel-editor-wrapper .ProseMirror pre {
          background: #1f2937;
          color: #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.25rem 1.5rem;
          font-family: ui-monospace, monospace;
          font-size: 0.875rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          line-height: 1.6;
        }
        .novel-editor-wrapper .ProseMirror pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          font-weight: 400;
        }

        /* ── Images ── */
        .novel-editor-wrapper .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s;
        }
        .novel-editor-wrapper .ProseMirror img:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
        .novel-editor-wrapper .ProseMirror img.ProseMirror-selectednode {
          outline: 3px solid #255f38;
          outline-offset: 2px;
          border-radius: 0.75rem;
        }

        /* ── Selection ── */
        .novel-editor-wrapper .ProseMirror ::selection {
          background-color: rgba(37, 95, 56, 0.18);
        }
        .novel-editor-wrapper .ProseMirror .ProseMirror-selectednode {
          outline: 2px solid #255f38;
          border-radius: 0.25rem;
        }

        /* ── Task List ── */
        .novel-editor-wrapper .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding-left: 0;
        }
        .novel-editor-wrapper .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .novel-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label {
          flex-shrink: 0;
          margin-top: 0.35rem;
        }
        .novel-editor-wrapper .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] {
          accent-color: #255f38;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }
        .novel-editor-wrapper .ProseMirror ul[data-type="taskList"] li[data-checked="true"] > div > p {
          text-decoration: line-through;
          color: #9ca3af;
        }

        /* ── Resize Handle ── */
        .novel-editor-wrapper .ProseMirror .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }
      `}</style>
    </div>
  );
}
