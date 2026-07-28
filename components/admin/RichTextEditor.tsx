"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

type HeadingLevel = 1 | 2 | 3;

// Substack/Medium-style writing surface: a heading-style picker, inline
// formatting, lists, a link button, and inline image upload (button or
// paste/drop) — output is a plain HTML string kept in sync with a hidden
// form field so it posts along with the rest of the resource form.
export function RichTextEditor({ name, initialHtml }: { name: string; initialHtml: string }) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({
        placeholder: "Write the piece…",
      }),
    ],
    content: initialHtml || "",
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[400px] font-reading text-[17px] leading-[1.8] text-ink focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      if (hiddenInputRef.current) hiddenInputRef.current.value = editor.getHTML();
    },
  });

  useEffect(() => {
    if (editor && hiddenInputRef.current) {
      hiddenInputRef.current.value = editor.getHTML();
    }
  }, [editor]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return;
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        alert("Image upload failed.");
        return;
      }
      const { url } = await res.json();
      editor.chain().focus().setImage({ src: url }).run();
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} onUploadImage={uploadImage} />
      <div
        className="border-line bg-paper rounded-t-none rounded-b-[12px] border border-t-0 px-4 py-4"
        onDrop={(e) => {
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("image/")) {
            e.preventDefault();
            uploadImage(file);
          }
        }}
        onPaste={(e) => {
          const file = Array.from(e.clipboardData.files).find((f) => f.type.startsWith("image/"));
          if (file) {
            e.preventDefault();
            uploadImage(file);
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <input ref={hiddenInputRef} type="hidden" name={name} defaultValue={initialHtml} />
    </div>
  );
}

function Toolbar({
  editor,
  onUploadImage,
}: {
  editor: Editor;
  onUploadImage: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function headingValue(): string {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("blockquote")) return "quote";
    return "p";
  }

  function setHeading(value: string) {
    const chain = editor.chain().focus();
    if (value === "p") chain.setParagraph().run();
    else if (value === "quote") chain.setBlockquote().run();
    else chain.setHeading({ level: Number(value.slice(1)) as HeadingLevel }).run();
  }

  function setLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  }

  return (
    <div className="border-line bg-cream flex flex-wrap items-center gap-1.5 rounded-t-[12px] border px-3 py-2.5">
      <select
        value={headingValue()}
        onChange={(e) => setHeading(e.target.value)}
        className="border-line bg-paper font-ui rounded-[7px] border px-2 py-1.5 text-[12.5px] font-semibold"
      >
        <option value="p">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="quote">Quote</option>
      </select>

      <ToolbarButton
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton active={editor.isActive("link")} onClick={setLink}>
        Link
      </ToolbarButton>
      <ToolbarButton active={false} onClick={() => fileInputRef.current?.click()}>
        + Image
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadImage(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-[7px] border px-2.5 py-1.5 text-[12.5px] font-semibold transition-colors " +
        (active
          ? "border-ink bg-ink text-cream"
          : "border-line bg-paper text-ink-muted hover:border-gold-deep hover:text-ink")
      }
    >
      {children}
    </button>
  );
}
