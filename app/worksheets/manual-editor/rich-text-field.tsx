"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

type Props = {
  html: string;
  onChange: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  className?: string;
  onEditorReady?: (editor: Editor | null) => void;
};

export default function RichTextField({
  html,
  onChange,
  editable = true,
  placeholder = "متن را بنویسید...",
  onFocus,
  className = "",
  onEditorReady,
}: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["paragraph"],
        defaultAlignment: "right",
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: html,
    editable,
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm max-w-none min-h-[2.5rem] outline-none text-foreground leading-7 [&_p]:m-0",
        dir: "rtl",
        style: "font-family: var(--font-vazirmatn), Tahoma, sans-serif;",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    onFocus: () => {
      onFocus?.();
      onEditorReady?.(editor);
    },
  });

  useEffect(() => {
    onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (htmlToComparable(html) !== htmlToComparable(current)) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
  }, [html, editor]);

  useEffect(() => {
    if (editor) editor.setEditable(editable);
  }, [editor, editable]);

  return (
    <div className={`rounded-lg ${className}`}>
      <EditorContent editor={editor} />
    </div>
  );
}

function htmlToComparable(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}
