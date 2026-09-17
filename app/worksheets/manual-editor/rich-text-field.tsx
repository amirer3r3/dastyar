"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Extension } from "@tiptap/core";
import { useEffect, useMemo } from "react";
import type { CSSProperties } from "react";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              (element as HTMLElement).style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

type Props = {
  html: string;
  onChange: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  onEditorReady?: (editor: Editor | null) => void;
  /** عرض کامل کادر — متن RTL تا لبهٔ چپ */
  fillWidth?: boolean;
  /** اندازه/فونت پایه — اولویت بر کلاس‌های ثابت (مثل prose-sm) */
  typography?: Pick<CSSProperties, "fontSize" | "fontFamily" | "lineHeight">;
};

export default function RichTextField({
  html,
  onChange,
  editable = true,
  placeholder = "متن را بنویسید...",
  onFocus,
  onBlur,
  className = "",
  onEditorReady,
  fillWidth = false,
  typography,
}: Props) {
  const editorSurfaceStyle = useMemo(() => {
    const parts = [
      "font-family: var(--font-vazirmatn), Tahoma, sans-serif",
      "width: 100%",
      "unicode-bidi: plaintext",
    ];
    if (typography?.fontFamily) {
      parts[0] = `font-family: ${typography.fontFamily}`;
    }
    if (typography?.fontSize) {
      parts.push(`font-size: ${typography.fontSize}`);
    }
    if (typography?.lineHeight !== undefined) {
      parts.push(`line-height: ${typography.lineHeight}`);
    }
    return parts.join("; ");
  }, [typography?.fontFamily, typography?.fontSize, typography?.lineHeight]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
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
          "tiptap max-w-none min-h-[2.5rem] w-full outline-none [&_p]:m-0 [&_p]:block [&_p]:w-full",
        dir: "rtl",
        style: editorSurfaceStyle,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    onFocus: () => {
      onFocus?.();
    },
    onBlur: () => {
      onBlur?.();
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

  useEffect(() => {
    if (!editor) return;
    const root = editor.view.dom as HTMLElement;
    root.style.fontFamily =
      typography?.fontFamily ??
      'var(--font-vazirmatn), Tahoma, sans-serif';
    if (typography?.fontSize !== undefined) {
      root.style.fontSize = String(typography.fontSize);
    }
    if (typography?.lineHeight !== undefined) {
      root.style.lineHeight = String(typography.lineHeight);
    }
  }, [editor, typography?.fontFamily, typography?.fontSize, typography?.lineHeight]);

  return (
    <div
      className={`${className} ${
        fillWidth
          ? "block w-full min-w-0 [&_.tiptap]:w-full [&_.ProseMirror]:w-full"
          : ""
      }`}
      style={
        typography
          ? {
              fontSize:
                typography.fontSize !== undefined
                  ? String(typography.fontSize)
                  : undefined,
              fontFamily: typography.fontFamily,
              lineHeight:
                typography.lineHeight !== undefined
                  ? String(typography.lineHeight)
                  : undefined,
            }
          : undefined
      }
    >
      <EditorContent editor={editor} />
    </div>
  );
}

function htmlToComparable(html: string): string {
  return html.replace(/\s+/g, " ").trim();
}
