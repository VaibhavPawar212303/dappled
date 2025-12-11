"use client"

import React, { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { cn } from "@/lib/utils"; 
import { FileUpload } from "@/components/file-upload"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo, 
  Code,
  Heading1,
  Heading2,
  Maximize,
  Minimize,
  ImageIcon
} from "lucide-react";

interface Props {
  content: string;
  onChange: (value: string) => void;
}

// --- Toolbar Component ---
const Toolbar = ({ 
  editor, 
  isExpanded, 
  onToggleExpand,
  onImageClick 
}: { 
  editor: Editor | null, 
  isExpanded: boolean, 
  onToggleExpand: () => void,
  onImageClick: () => void
}) => {
  if (!editor) return null;

  const toggleButton = (
    isActive: boolean, 
    onClick: () => void, 
    icon: React.ReactNode, 
    label: string
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "p-2 rounded-md transition-colors",
        isActive 
          ? "bg-slate-950 text-white" 
          : "bg-transparent hover:bg-slate-200 text-slate-700"
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-input bg-transparent rounded-t-md p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 bg-white">
      {/* History */}
      {toggleButton(false, () => editor.chain().focus().undo().run(), <Undo className="h-4 w-4" />, "Undo")}
      {toggleButton(false, () => editor.chain().focus().redo().run(), <Redo className="h-4 w-4" />, "Redo")}
      <div className="w-[1px] h-6 bg-slate-300 mx-1" />

      {/* Headings */}
      {toggleButton(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="h-4 w-4" />, "H1")}
      {toggleButton(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />, "H2")}
      <div className="w-[1px] h-6 bg-slate-300 mx-1" />

      {/* Basic Formatting */}
      {toggleButton(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="h-4 w-4" />, "Bold")}
      {toggleButton(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-4 w-4" />, "Italic")}
      {toggleButton(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="h-4 w-4" />, "Underline")}
      {toggleButton(editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), <Strikethrough className="h-4 w-4" />, "Strike")}
      {toggleButton(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), <Code className="h-4 w-4" />, "Code")}
      <div className="w-[1px] h-6 bg-slate-300 mx-1" />

      {/* Alignment */}
      {toggleButton(editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), <AlignLeft className="h-4 w-4" />, "Left")}
      {toggleButton(editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), <AlignCenter className="h-4 w-4" />, "Center")}
      {toggleButton(editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), <AlignRight className="h-4 w-4" />, "Right")}
      <div className="w-[1px] h-6 bg-slate-300 mx-1" />

      {/* Lists & Media */}
      {toggleButton(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />, "Bullet List")}
      {toggleButton(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />, "Ordered List")}
      {toggleButton(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-4 w-4" />, "Blockquote")}
      
      {/* Image Button */}
      {toggleButton(editor.isActive("image"), onImageClick, <ImageIcon className="h-4 w-4" />, "Add Image")}
      
      {/* Spacer */}
      <div className="flex-1" />
      
      {/* Expand / Minimize Button */}
      {toggleButton(
        isExpanded, 
        onToggleExpand, 
        isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />, 
        isExpanded ? "Minimize" : "Full Screen"
      )}
    </div>
  );
};

// --- Main Editor Component ---
export const TiptapEditor: React.FC<Props> = ({ content, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2] 
        }
      }),
      Underline,
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
            class: "text-blue-500 underline cursor-pointer"
        }
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md border my-4 max-w-full h-auto",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[150px] border border-input bg-background rounded-b-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 prose max-w-none",
          isExpanded && "h-full border-0 focus-visible:ring-0"
        )
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const onImageUploadComplete = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setIsImageDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        {/* 
            ✅ FIX: Add z-[999999] here. 
            The expanded editor is z-[99999], so this must be higher 
            to appear on top of the full-screen editor.
        */}
        <DialogContent className="sm:max-w-md z-[999999]">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) onImageUploadComplete(url);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div 
        className={cn(
          "flex flex-col justify-stretch",
          isExpanded 
            ? "fixed inset-0 z-[99999] bg-white w-full h-full p-4 overflow-hidden" 
            : "min-h-[250px]"
        )}
      >
        <Toolbar 
          editor={editor} 
          isExpanded={isExpanded} 
          onToggleExpand={toggleExpand}
          onImageClick={() => setIsImageDialogOpen(true)}
        />
        
        <div className={cn(
          isExpanded && "flex-1 overflow-y-auto border border-input rounded-b-md"
        )}>
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </>
  );
};  