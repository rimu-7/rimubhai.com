"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Toggle } from "@/components/ui/toggle"; // Ensure you have shadcn toggle: npx shadcn@latest add toggle
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link2,
  Image as ImageIcon, Highlighter, Pilcrow
} from "lucide-react";

// --- MENU BAR COMPONENT ---
const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const options = [
    { icon: <Heading1 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
    { icon: <Heading2 className="h-4 w-4" />, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
    { icon: <Bold className="h-4 w-4" />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: <Italic className="h-4 w-4" />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: <List className="h-4 w-4" />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
    { icon: <ListOrdered className="h-4 w-4" />, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
    { icon: <AlignLeft className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }) },
    { icon: <AlignCenter className="h-4 w-4" />, action: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }) },
    { icon: <Link2 className="h-4 w-4" />, action: setLink, active: editor.isActive("link") },
    { icon: <ImageIcon className="h-4 w-4" />, action: addImage, active: false },
  ];

  return (
    <div className="border-b p-2 flex flex-wrap gap-1 bg-muted/20">
      {options.map((item, i) => (
        <Toggle
          key={i}
          size="sm"
          pressed={item.active}
          onPressedChange={item.action}
          className="h-8 w-8 p-0"
        >
          {item.icon}
        </Toggle>
      ))}
    </div>
  );
};

// --- MAIN EDITOR COMPONENT ---
export default function RichTextEditor({ content = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-4" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-4" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: true, HTMLAttributes: { class: "rounded-lg border max-h-[300px] w-auto my-2" } }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[200px] w-full p-4 outline-none prose prose-sm dark:prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full rounded-md border bg-background">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}