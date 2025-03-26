import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlock from "@tiptap/extension-code-block"

// Common extension configuration for both editor and preview
export const createEditorExtensions = (isEditable = true) => [
  StarterKit.configure({
    // Disable CodeBlock to prevent conflicts
    codeBlock: false,
  }),
  Link.configure({
    openOnClick: !isEditable, // Only clickable in preview mode
    HTMLAttributes: {
      class: "text-blue-500 underline cursor-pointer hover:text-blue-700",
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "rounded-md max-w-full",
    },
  }),
  CodeBlock.configure({
    HTMLAttributes: {
      class: "bg-indigo-950 text-indigo-300 p-4 rounded-md font-mono text-sm my-4 overflow-x-auto",
    },
  }),
] 