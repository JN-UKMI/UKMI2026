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
  type EditorInstance,
  type JSONContent,
} from "novel";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  defaultExtensions,
  setImageUploadHandler,
  uploadImageToSanity,
  blockExitState,
} from "./extensions";
import { suggestionItems } from "./slash-commands";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
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
      className={`p-1.5 rounded-md transition text-sm flex items-center justify-center cursor-pointer ${
        isActive
          ? "bg-forest-100 text-forest-800 shadow-sm ring-1 ring-forest-200"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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

// ── Top Toolbar (receives editor instance as prop) ─
function EditorToolbar({ editor }: { editor: EditorInstance }) {
  // Hooks must be before any conditional return (rules of hooks)
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

  const handleLink = useCallback(() => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt("Masukkan URL:", "https://");
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  // Determine current heading level
  const activeHeading = editor.isActive("heading");
  const headingLevel = activeHeading
    ? (editor.getAttributes("heading").level as number)
    : 0;

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-3 py-2 flex flex-wrap items-center gap-0.5 rounded-t-2xl">
      {/* Paragraph / Heading Type Selector */}
      <select
        value={headingLevel > 0 ? String(headingLevel) : "p"}
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
        className="h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600 mr-1"
        title="Tipe paragraf"
      >
        <option value="p">Paragraf</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>

      <ToolbarDivider />

      {/* Text Formatting */}
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

      {/* Lists */}
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

      {/* Blocks */}
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

      {/* Media & Links */}
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

  return (
    <>
      {/* Bold */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleBold().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md transition-colors ${
            editor.isActive("bold")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </EditorBubbleItem>

      <div className="mx-1 h-5 w-px bg-gray-200" />

      {/* Inline Code */}
      <EditorBubbleItem
        onSelect={() => editor.chain().focus().toggleCode().run()}
      >
        <button
          className={`h-8 w-8 flex items-center justify-center rounded-md text-xs font-mono font-bold transition-colors ${
            editor.isActive("code")
              ? "bg-forest-600 text-white shadow-sm"
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
              : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
    <EditorCommand className="z-50 h-auto max-h-[360px] w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-xl shadow-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
      <EditorCommandEmpty className="px-3 py-3 text-sm text-gray-400 dark:text-gray-500 text-center">
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
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-sm">
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 dark:text-white text-[13px]">
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight mt-0.5">
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

// ── Sanitise HTML content (strip inline colour/font styles) ──
function sanitizeHtml(html: string): string {
  return html
    .replace(/<font[^>]*>/gi, "")
    .replace(/<\/font>/gi, "")
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
    .replace(/\sstyle\s*=\s*'[^']*'/gi, "");
}

// ── Block-quote ancestor helper ─────────────────────────────
// Returns the depth of the nearest enclosing blockquote, or 0
function findBlockquoteDepth($from: { depth: number; node: (d: number) => { type: { name: string } } }) {
  for (let d = $from.depth; d > 0; d--) {
    if ($from.node(d).type.name === "blockquote") return d;
  }
  return 0;
}

// ── Main Editor Component ────────────────────────────────────
export default function NovelEditor({
  initialContent,
  onChange,
  uploadFn,
}: NovelEditorProps) {
  const [mounted, setMounted] = useState(false);
  const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(null);
  const editorInstanceRef = useRef<EditorInstance | null>(null);
  const cleanupHandlersRef = useRef<(() => void) | null>(null);

  // Track which block type the cursor is currently inside (for shortcut hint)
  const [blockHint, setBlockHint] = useState<"codeBlock" | "blockquote" | null>(null);

  // Keep latest values accessible from stable callbacks
  const initialContentRef = useRef(initialContent);
  // eslint-disable-next-line react-hooks/refs -- intentional: keep ref in sync with latest prop
  initialContentRef.current = initialContent;

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard mount detector
    setMounted(true);
  }, []);

  // Cleanup event handlers on unmount
  useEffect(() => {
    return () => {
      cleanupHandlersRef.current?.();
    };
  }, []);

  // Sync external content changes (for edit page)
  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (!editor || !initialContent) return;
    const sanitized = sanitizeHtml(initialContent);
    const currentContent = editor.getHTML();
    if (currentContent !== sanitized) {
      editor.commands.setContent(sanitized, false);
    }
  }, [initialContent]);

  const handleUpdate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      onChange(editor.getHTML());
    },
    [onChange]
  );

  // Track cursor block type for keyboard shortcut hints
  const handleSelectionUpdate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      const $from = editor.state.selection.$from;
      const parentName = $from.parent.type.name;

      if (parentName === "codeBlock") {
        setBlockHint("codeBlock");
        return;
      }
      if (findBlockquoteDepth($from) > 0) {
        setBlockHint("blockquote");
        return;
      }
      setBlockHint(null);
    },
    []
  );

  // ── Editor onCreate: capture instance, sync content, attach event handlers ──
  const handleCreate = useCallback(
    ({ editor }: { editor: EditorInstance }) => {
      editorInstanceRef.current = editor;
      setEditorInstance(editor); // trigger re-render so toolbar appears

      // Sync initial content immediately when editor is ready
      const content = initialContentRef.current;
      if (content) {
        const sanitized = sanitizeHtml(content);
        const currentContent = editor.getHTML();
        if (currentContent !== sanitized) {
          editor.commands.setContent(sanitized, false);
        }
      }

      // Drag & drop handler
      const handleDrop = async (event: DragEvent) => {
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
      };

      // Paste handler
      const handlePaste = async (event: ClipboardEvent) => {
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
      };

      editor.view.dom.addEventListener("drop", handleDrop);
      editor.view.dom.addEventListener("paste", handlePaste);

      // Store cleanup for unmount
      cleanupHandlersRef.current = () => {
        editor.view.dom.removeEventListener("drop", handleDrop);
        editor.view.dom.removeEventListener("paste", handlePaste);
      };
    },
    // Stable callback — uses refs for latest values
    []
  );

  if (!mounted) {
    return (
      <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
          <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-transparent animate-spin" />
          <span className="text-sm">Memuat editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full editor-container">
      {/* Toolbar outside EditorRoot — receives editor via prop for reliable rendering */}
      {editorInstance && <EditorToolbar editor={editorInstance} />}

      <EditorRoot>
        <EditorContent
          extensions={defaultExtensions}
          initialContent={initialContent as unknown as JSONContent}
          className="novel-editor-wrapper"
          onUpdate={handleUpdate}
          onCreate={handleCreate}
          onSelectionUpdate={handleSelectionUpdate as unknown as (props: { editor: EditorInstance }) => void}
          onBlur={() => setBlockHint(null)}
          immediatelyRender={false}
          editorProps={{
            attributes: {
              class:
                "prose prose-lg focus:outline-none max-w-none min-h-[500px] px-8 py-8",
            },
            handleDOMEvents: {
              keydown: (view, event) => {
                const ke = event as KeyboardEvent;

                // ── Helpers ──────────────────────────────
                const $from = view.state.selection.$from;
                const parentName = $from.parent.type.name;
                const isMod = ke.ctrlKey || ke.metaKey;
                const isEnter = ke.key === "Enter";
                const bqDepth = findBlockquoteDepth($from);
                const isInCodeBlock = parentName === "codeBlock";
                const isInBlockquote = bqDepth > 0;

                // ── Ctrl/Cmd + Enter: force-exit any block ──
                if (isEnter && isMod && (isInCodeBlock || isInBlockquote)) {
                  ke.preventDefault();
                  // Exit *after* the block, not just after the inner paragraph
                  const exitDepth = isInCodeBlock ? $from.depth : bqDepth;
                  const exitPos = $from.after(exitDepth);
                  const tr = view.state.tr;
                  const para = view.state.schema.nodes.paragraph.create();
                  view.dispatch(tr.replaceWith(exitPos, exitPos, para));
                  view.focus();
                  return true;
                }

                // ── Enter on empty paragraph inside blockquote: lift out ──
                if (
                  isEnter &&
                  !isMod &&
                  isInBlockquote &&
                  parentName === "paragraph" &&
                  $from.parent.textContent === ""
                ) {
                  ke.preventDefault();
                  const ed = editorInstanceRef.current;
                  if (ed) {
                    ed.chain().focus().liftEmptyBlock().run();
                  }
                  return true;
                }

                // ── Double Enter in code block: exit ──
                if (isEnter && !isMod && isInCodeBlock) {
                  const now = Date.now();
                  if (
                    blockExitState.lastEnterBlock === "codeBlock" &&
                    now - blockExitState.lastEnterTime < 500
                  ) {
                    ke.preventDefault();
                    blockExitState.lastEnterBlock = "";
                    blockExitState.lastEnterTime = 0;
                    const exitPos = $from.after($from.depth);
                    const tr = view.state.tr;
                    const para = view.state.schema.nodes.paragraph.create();
                    view.dispatch(tr.replaceWith(exitPos, exitPos, para));
                    view.focus();
                    return true;
                  }
                  blockExitState.lastEnterBlock = "codeBlock";
                  blockExitState.lastEnterTime = now;
                } else if (isInCodeBlock && !isEnter) {
                  // Reset double-enter tracking on any non-Enter key inside code block
                  blockExitState.lastEnterBlock = "";
                  blockExitState.lastEnterTime = 0;
                } else if (!isInCodeBlock) {
                  // Reset when outside code block entirely
                  blockExitState.lastEnterBlock = "";
                  blockExitState.lastEnterTime = 0;
                }

                // Fall through to novel's command navigation
                return handleCommandNavigation(ke);
              },
            },
            transformPastedHTML(html) {
              return html
                .replace(/<font[^>]*>/gi, "")
                .replace(/<\/font>/gi, "")
                .replace(/<span[^>]*>/gi, "")
                .replace(/<\/span>/gi, "")
                .replace(/\sstyle\s*=\s*"[^"]*"/gi, "")
                .replace(/\sstyle\s*=\s*'[^']*'/gi, "")
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

      {/* ── Floating Keyboard Shortcut Hint ── */}
      {blockHint && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-gray-900/95 backdrop-blur text-white text-xs px-3.5 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/10">
            <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide">Ctrl+Enter</kbd>
            <span className="text-gray-400 dark:text-gray-500">atau</span>
            {blockHint === "codeBlock" ? (
              <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide">Enter 2×</kbd>
            ) : (
              <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide">Enter</kbd>
            )}
            <span className="text-gray-400 dark:text-gray-500">
              {blockHint === "codeBlock"
                ? "untuk keluar"
                : "di baris kosong untuk keluar"}
            </span>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* ── Editor Container ── */
        .editor-container {
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          overflow: hidden;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
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
        .novel-editor-wrapper
          .ProseMirror
          p.is-editor-empty:first-child::before {
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
        }
        .novel-editor-wrapper .ProseMirror code::before,
        .novel-editor-wrapper .ProseMirror code::after {
          content: none;
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
        .novel-editor-wrapper .ProseMirror ul li::marker {
          color: #255f38;
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
        .novel-editor-wrapper
          .ProseMirror
          img.ProseMirror-selectednode {
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
        .novel-editor-wrapper
          .ProseMirror
          ul[data-type="taskList"]
          li
          > label {
          flex-shrink: 0;
          margin-top: 0.35rem;
        }
        .novel-editor-wrapper
          .ProseMirror
          ul[data-type="taskList"]
          li
          > label
          input[type="checkbox"] {
          accent-color: #255f38;
          width: 1rem;
          height: 1rem;
          cursor: pointer;
        }
        .novel-editor-wrapper
          .ProseMirror
          ul[data-type="taskList"]
          li[data-checked="true"]
          > div
          > p {
          text-decoration: line-through;
          color: #9ca3af;
        }

        /* ── Gap Cursor (klik di bawah block untuk paragraf baru) ── */
        .novel-editor-wrapper .ProseMirror-gapcursor {
          display: block;
          position: relative;
        }
        .novel-editor-wrapper .ProseMirror-gapcursor::after {
          content: "";
          display: block;
          border-top: 2px solid #255f38;
          width: 100%;
          animation: gapcursor-blink 1s step-end infinite;
        }
        /* Label: "Klik untuk paragraf baru" */
        .novel-editor-wrapper .ProseMirror-gapcursor::before {
          content: "Klik untuk paragraf baru";
          position: absolute;
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: #f9fafb;
          font-size: 0.6875rem;
          font-weight: 500;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0.92;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          animation: gapcursor-label-in 0.25s ease-out;
        }
        @keyframes gapcursor-label-in {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(6px);
          }
          to {
            opacity: 0.92;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes gapcursor-blink {
          50% {
            border-color: transparent;
          }
        }
        .dark .novel-editor-wrapper .ProseMirror-gapcursor::after {
          border-color: #499a13;
        }
        .dark .novel-editor-wrapper .ProseMirror-gapcursor::before {
          background: #e5e7eb;
          color: #111827;
        }

        /* ── Resize Handle ── */
        .novel-editor-wrapper .ProseMirror .resize-cursor {
          cursor: ew-resize;
          cursor: col-resize;
        }

        /* ── Dark mode: editor ── */
        .dark .editor-container {
          background: #111827;
          border-color: #1f2937;
        }
        .dark .editor-container:focus-within {
          border-color: #499a13;
          box-shadow: 0 0 0 3px rgba(73, 154, 19, 0.08);
        }
        .dark .novel-editor-wrapper .ProseMirror {
          color: #e5e7eb;
          caret-color: #499a13;
        }
        .dark .novel-editor-wrapper .ProseMirror h1,
        .dark .novel-editor-wrapper .ProseMirror h2,
        .dark .novel-editor-wrapper .ProseMirror h3,
        .dark .novel-editor-wrapper .ProseMirror h4 {
          color: #f9fafb;
        }
        .dark .novel-editor-wrapper .ProseMirror p {
          color: #d1d5db;
        }
        .dark .novel-editor-wrapper .ProseMirror strong {
          color: #f9fafb;
        }
        .dark .novel-editor-wrapper .ProseMirror code {
          background: #1f2937;
          color: #86efac;
        }
        .dark .novel-editor-wrapper .ProseMirror blockquote {
          background: #0d2818;
          color: #9ca3af;
          border-left-color: #499a13;
        }
        .dark .novel-editor-wrapper .ProseMirror a {
          color: #499a13;
        }
        .dark .novel-editor-wrapper .ProseMirror a:hover {
          color: #73c91d;
        }
        .dark .novel-editor-wrapper .ProseMirror ul li::marker {
          color: #499a13;
        }
        .dark .novel-editor-wrapper .ProseMirror ::selection {
          background-color: rgba(73, 154, 19, 0.2);
        }
        .dark
          .novel-editor-wrapper
          .ProseMirror
          p.is-editor-empty:first-child::before {
          color: #6b7280;
        }

        /* ── Dark mode: toolbar ── */
        .dark .editor-container .sticky {
          background: #111827;
          border-color: #1f2937;
        }
      `}</style>
    </div>
  );
}
