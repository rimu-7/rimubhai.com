"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import MenuBar from "./menu-bar";

export default function RichTextEditor({ content = "", onChange }) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-6" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-6" } },
      }),

      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class:
            "text-blue-600 underline underline-offset-2 dark:text-blue-400",
        },
      }),

      // ✅ Small image + dark friendly border handled by CSS
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "tiptap-image" },
      }),
    ],

    content,

    editorProps: {
      attributes: {
        class:
          // ✅ Dark/Light friendly editor surface
          "tiptap min-h-[180px] w-full rounded-md border px-3 py-2 shadow-sm outline-none " +
          "border-slate-200 bg-white text-slate-900 " +
          "focus:ring-2 focus:ring-slate-400/25 " +
          "dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-300/20",
      },
    },

    onUpdate: ({ editor }) => {
      if (typeof onChange === "function") onChange(editor.getHTML());
    },
  });

  // ✅ keep external `content` in sync (without update loop)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = content ?? "";
    if (next !== current) {
      editor.commands.setContent(next, false);
    }
  }, [editor, content]);

  return (
    <div className="space-y-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
