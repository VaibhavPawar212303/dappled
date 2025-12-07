"use client"

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

export const TiptapEditor: React.FC<Props> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 p-4 rounded-md space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "font-bold text-blue-500" : ""}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "italic text-blue-500" : ""}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "underline text-blue-500" : ""}
        >
          Underline
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[150px] border p-2 rounded" />
    </div>
  );
};