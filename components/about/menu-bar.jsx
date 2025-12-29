"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pilcrow,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "../ui/toggle";

export default function MenuBar({ editor }) {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (!url || !url.trim()) return;

    const alt = window.prompt("Alt text (optional)") || "";
    editor.chain().focus().setImage({ src: url.trim(), alt }).run();
  };

  const options = [
    { icon: <Pilcrow className="size-4" />, pressed: editor.isActive("paragraph"), onClick: () => editor.chain().focus().setParagraph().run() },

    { icon: <Heading1 className="size-4" />, pressed: editor.isActive("heading", { level: 1 }), onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: <Heading2 className="size-4" />, pressed: editor.isActive("heading", { level: 2 }), onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: <Heading3 className="size-4" />, pressed: editor.isActive("heading", { level: 3 }), onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },

    { icon: <Bold className="size-4" />, pressed: editor.isActive("bold"), onClick: () => editor.chain().focus().toggleBold().run() },
    { icon: <Italic className="size-4" />, pressed: editor.isActive("italic"), onClick: () => editor.chain().focus().toggleItalic().run() },
    { icon: <Strikethrough className="size-4" />, pressed: editor.isActive("strike"), onClick: () => editor.chain().focus().toggleStrike().run() },

    { icon: <Code className="size-4" />, pressed: editor.isActive("code"), onClick: () => editor.chain().focus().toggleCode().run() },
    { icon: <Code2 className="size-4" />, pressed: editor.isActive("codeBlock"), onClick: () => editor.chain().focus().toggleCodeBlock().run() },

    { icon: <Link2 className="size-4" />, pressed: editor.isActive("link"), onClick: setLink },
    { icon: <ImageIcon className="size-4" />, pressed: false, onClick: addImage },

    { icon: <AlignLeft className="size-4" />, pressed: editor.isActive({ textAlign: "left" }), onClick: () => editor.chain().focus().setTextAlign("left").run() },
    { icon: <AlignCenter className="size-4" />, pressed: editor.isActive({ textAlign: "center" }), onClick: () => editor.chain().focus().setTextAlign("center").run() },
    { icon: <AlignRight className="size-4" />, pressed: editor.isActive({ textAlign: "right" }), onClick: () => editor.chain().focus().setTextAlign("right").run() },

    { icon: <List className="size-4" />, pressed: editor.isActive("bulletList"), onClick: () => editor.chain().focus().toggleBulletList().run() },
    { icon: <ListOrdered className="size-4" />, pressed: editor.isActive("orderedList"), onClick: () => editor.chain().focus().toggleOrderedList().run() },

    { icon: <Highlighter className="size-4" />, pressed: editor.isActive("highlight"), onClick: () => editor.chain().focus().toggleHighlight().run() },
  ];

  return (
    <div
      className="
        flex flex-wrap gap-2 rounded-md border px-2 py-2
        border-slate-200 bg-white/80 text-slate-900
        backdrop-blur
        dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100
      "
    >
      {options.map((o, i) => (
        <Toggle
          key={i}
          pressed={o.pressed}
          onPressedChange={() => o.onClick()}
          className="
            h-9 w-9 p-0
            border border-transparent
            hover:bg-slate-100 hover:text-slate-900
            dark:hover:bg-slate-900/60 dark:hover:text-slate-100
            data-[state=on]:bg-slate-900 data-[state=on]:text-white
            dark:data-[state=on]:bg-slate-100 dark:data-[state=on]:text-slate-900
          "
        >
          {o.icon}
        </Toggle>
      ))}
    </div>
  );
}
