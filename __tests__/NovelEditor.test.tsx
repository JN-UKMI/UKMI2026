import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";

// ── Mock `novel` package before NovelEditor is imported ─────
// This avoids the react-tweet CSS module issue entirely.
const mockEditorChain = {
  focus: () => mockEditorChain,
  toggleBold: () => mockEditorChain,
  toggleItalic: () => mockEditorChain,
  toggleUnderline: () => mockEditorChain,
  toggleStrike: () => mockEditorChain,
  toggleCode: () => mockEditorChain,
  toggleBulletList: () => mockEditorChain,
  toggleOrderedList: () => mockEditorChain,
  toggleTaskList: () => mockEditorChain,
  toggleBlockquote: () => mockEditorChain,
  toggleCodeBlock: () => mockEditorChain,
  setHorizontalRule: () => mockEditorChain,
  setParagraph: () => mockEditorChain,
  setNode: () => mockEditorChain,
  setImage: () => mockEditorChain,
  setLink: () => mockEditorChain,
  unsetLink: () => mockEditorChain,
  setContent: () => mockEditorChain,
  deleteRange: () => mockEditorChain,
  insertContent: () => mockEditorChain,
  run: vi.fn(),
};

const mockEditor = {
  chain: () => mockEditorChain,
  isActive: vi.fn().mockReturnValue(false),
  getAttributes: vi.fn().mockReturnValue({ level: 1 }),
  getHTML: vi.fn().mockReturnValue("<p></p>"),
  getJSON: vi.fn().mockReturnValue({}),
  commands: {
    setContent: vi.fn(),
  },
  view: {
    dom: document.createElement("div"),
  },
};

// React component mocks for novel's Editor* components
function MockEditorRoot({ children }: { children: React.ReactNode }) {
  return React.createElement("div", { "data-testid": "editor-root" }, children);
}
function MockEditorContent({
  children,
  onCreate,
  onUpdate,
  initialContent,
  className,
}: any) {
  // Fire onCreate immediately to simulate editor initialization
  React.useEffect(() => {
    if (onCreate) {
      const cleanup = onCreate({ editor: mockEditor });
      return typeof cleanup === "function" ? cleanup : undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fire onUpdate on mount to simulate initial content
  React.useEffect(() => {
    if (onUpdate) {
      onUpdate({ editor: mockEditor });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return React.createElement(
    "div",
    {
      "data-testid": "editor-content",
      className,
      contentEditable: true,
    },
    children
  );
}
function MockEditorBubble({ children, className }: any) {
  return React.createElement(
    "div",
    { "data-testid": "editor-bubble", className },
    children
  );
}
function MockEditorBubbleItem({ children, onSelect }: any) {
  return React.createElement(
    "div",
    { "data-testid": "bubble-item", onClick: onSelect },
    children
  );
}
function MockEditorCommand({ children, className }: any) {
  return React.createElement(
    "div",
    { "data-testid": "editor-command", className },
    children
  );
}
function MockEditorCommandItem({ children, onCommand, value }: any) {
  return React.createElement(
    "div",
    { "data-testid": "command-item", onClick: () => onCommand?.(value) },
    children
  );
}
function MockEditorCommandEmpty({ children }: any) {
  return React.createElement("div", { "data-testid": "command-empty" }, children);
}
function MockEditorCommandList({ children }: any) {
  return React.createElement("div", { "data-testid": "command-list" }, children);
}
function MockUseEditor() {
  return { editor: mockEditor };
}

vi.mock("novel", () => ({
  EditorRoot: MockEditorRoot,
  EditorContent: MockEditorContent,
  EditorBubble: MockEditorBubble,
  EditorBubbleItem: MockEditorBubbleItem,
  EditorCommand: MockEditorCommand,
  EditorCommandItem: MockEditorCommandItem,
  EditorCommandEmpty: MockEditorCommandEmpty,
  EditorCommandList: MockEditorCommandList,
  useEditor: MockUseEditor,
  handleCommandNavigation: vi.fn(),
}));

// ── Also mock the extensions module ──────────────────────────
vi.mock("@/components/editor/extensions", () => ({
  defaultExtensions: [],
  setImageUploadHandler: vi.fn(),
  uploadImageToSanity: vi.fn().mockResolvedValue("https://cdn.example.com/img.jpg"),
}));

// ── Mock the slash-commands module ───────────────────────────
vi.mock("@/components/editor/slash-commands", () => ({
  suggestionItems: [],
}));

// Now import the component under test
import NovelEditor from "@/components/editor/NovelEditor";

// ── Helpers ──────────────────────────────────────────────────

async function waitForEditor() {
  await waitFor(
    () => {
      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    },
    { timeout: 2000 }
  );
}

function renderEditor(
  props: Partial<{
    initialContent: string;
    onChange: (html: string) => void;
    uploadFn: (file: File) => Promise<string>;
  }> = {}
) {
  const onChange = props.onChange ?? vi.fn();
  const result = render(
    <NovelEditor
      initialContent={props.initialContent}
      onChange={onChange}
      uploadFn={props.uploadFn}
    />
  );
  return { ...result, onChange };
}

// ── Tests ────────────────────────────────────────────────────

describe("NovelEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock editor state
    mockEditor.isActive.mockReturnValue(false);
    mockEditor.getAttributes.mockReturnValue({ level: 1 });
    mockEditor.getHTML.mockReturnValue("<p></p>");
  });

  // ──────────────────────────────────────────────────────────
  // Rendering
  // ──────────────────────────────────────────────────────────

  describe("rendering", () => {
    it("renders editor container after mount", async () => {
      renderEditor();
      await waitForEditor();

      const container = document.querySelector(".editor-container");
      expect(container).toBeInTheDocument();
    });

    it("renders EditorRoot after mount", async () => {
      renderEditor();
      await waitForEditor();

      expect(screen.getByTestId("editor-root")).toBeInTheDocument();
    });

    it("renders EditorContent after mount", async () => {
      renderEditor();
      await waitForEditor();

      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Toolbar
  // ──────────────────────────────────────────────────────────

  describe("toolbar", () => {
    it("renders toolbar after editor mounts", async () => {
      renderEditor();
      await waitForEditor();

      expect(screen.getByTitle("Tebal (Ctrl+B)")).toBeInTheDocument();
      expect(screen.getByTitle("Miring (Ctrl+I)")).toBeInTheDocument();
    });

    it("renders all toolbar button groups", async () => {
      renderEditor();
      await waitForEditor();

      const allTitles = [
        "Tebal (Ctrl+B)",
        "Miring (Ctrl+I)",
        "Garis Bawah (Ctrl+U)",
        "Coret",
        "Kode Inline",
        "Daftar Poin",
        "Daftar Nomor",
        "Daftar Tugas",
        "Kutipan",
        "Blok Kode",
        "Garis Pemisah",
        "Tautan",
        "Sisipkan Gambar",
      ];

      for (const title of allTitles) {
        expect(screen.getByTitle(title)).toBeInTheDocument();
      }
    });

    it("renders heading type selector with default 'p'", async () => {
      renderEditor();
      await waitForEditor();

      const select = screen.getByTitle("Tipe paragraf");
      expect(select).toBeInTheDocument();
      expect(select).toHaveValue("p");
    });
  });

  // ──────────────────────────────────────────────────────────
  // onChange Callback
  // ──────────────────────────────────────────────────────────

  describe("onChange callback", () => {
    it("fires onChange after editor mounts", async () => {
      const onChange = vi.fn();
      renderEditor({ onChange });
      await waitForEditor();

      expect(onChange).toHaveBeenCalled();
    });

    it("onChange receives HTML string from editor", async () => {
      const html = "<p>Test content</p>";
      mockEditor.getHTML.mockReturnValue(html);

      const onChange = vi.fn();
      renderEditor({ onChange });
      await waitForEditor();

      expect(onChange).toHaveBeenCalledWith(html);
    });

    it("onChange is called with editor.getHTML result", async () => {
      const onChange = vi.fn();
      renderEditor({ onChange });
      await waitForEditor();

      // Verify getHTML was called to produce onChange value
      expect(mockEditor.getHTML).toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────────────────
  // initialContent
  // ──────────────────────────────────────────────────────────

  describe("initialContent", () => {
    it("passes initialContent to EditorContent", async () => {
      const html = "<p>Konten awal</p>";
      renderEditor({ initialContent: html });
      await waitForEditor();

      const editorContent = screen.getByTestId("editor-content");
      expect(editorContent).toBeInTheDocument();
    });

    it("handles undefined initialContent gracefully", async () => {
      renderEditor({ initialContent: undefined });
      await waitForEditor();

      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });

    it("sets editor content when initialContent is provided", async () => {
      const html = "<p>Konten spesifik</p>";
      mockEditor.getHTML.mockReturnValue(""); // Empty current content
      // This simulates: editor is empty, initialContent is provided,
      // so setContent should be called

      renderEditor({ initialContent: html });
      await waitForEditor();

      // setContent should be called to sync initialContent into editor
      expect(mockEditor.commands.setContent).toHaveBeenCalled();
    });

    it("syncs content when initialContent prop updates after mount", async () => {
      const onChange = vi.fn();
      const { rerender } = renderEditor({
        initialContent: "<p>Pertama</p>",
        onChange,
      });
      await waitForEditor();

      // Clear to measure fresh calls from the prop change
      mockEditor.commands.setContent.mockClear();
      mockEditor.getHTML.mockReturnValue("<p>Pertama</p>");

      // Rerender with new initialContent simulates edit page scenario
      rerender(
        <NovelEditor
          initialContent="<p>Kedua</p>"
          onChange={onChange}
        />
      );

      // The useEffect sync should call setContent with the new content
      expect(mockEditor.commands.setContent).toHaveBeenCalled();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Toolbar Interactions
  // ──────────────────────────────────────────────────────────

  describe("toolbar interactions", () => {
    it("bold button calls editor chain toggleBold", async () => {
      renderEditor();
      await waitForEditor();

      const boldBtn = screen.getByTitle("Tebal (Ctrl+B)");
      act(() => boldBtn.click());

      expect(mockEditorChain.run).toHaveBeenCalled();
    });

    it("italic button calls editor chain toggleItalic", async () => {
      renderEditor();
      await waitForEditor();

      const italicBtn = screen.getByTitle("Miring (Ctrl+I)");
      act(() => italicBtn.click());

      expect(mockEditorChain.run).toHaveBeenCalled();
    });

    it("toolbar buttons are rendered as button elements", async () => {
      renderEditor();
      await waitForEditor();

      const boldBtn = screen.getByTitle("Tebal (Ctrl+B)");
      expect(boldBtn.tagName).toBe("BUTTON");
      expect(boldBtn).toHaveAttribute("type", "button");
    });
  });

  // ──────────────────────────────────────────────────────────
  // Cleanup
  // ──────────────────────────────────────────────────────────

  describe("cleanup", () => {
    it("unmounts without throwing", async () => {
      const { unmount } = renderEditor();
      await waitForEditor();

      expect(() => unmount()).not.toThrow();
    });

    it("removes editor from DOM after unmount", async () => {
      const { unmount } = renderEditor();
      await waitForEditor();

      expect(
        document.querySelector(".editor-container")
      ).toBeInTheDocument();

      unmount();

      expect(
        document.querySelector(".editor-container")
      ).not.toBeInTheDocument();
    });
  });

  // ──────────────────────────────────────────────────────────
  // Upload Function
  // ──────────────────────────────────────────────────────────

  describe("uploadFn", () => {
    it("renders correctly when uploadFn is provided", async () => {
      const uploadFn = vi.fn().mockResolvedValue("https://cdn.example.com/img.jpg");
      renderEditor({ uploadFn });
      await waitForEditor();

      expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    });
  });
});
