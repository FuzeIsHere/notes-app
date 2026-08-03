import React, { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

// Import modular layout definitions
import styles from './RichTextEditor.module.css'

// 1. MenuBar Toolbar Layout
const MenuBar = ({ editor }) => {
  if (!editor) return null

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const toggleLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const url = window.prompt('Enter hyperlink URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url, target: '_blank' }).run()
    }
  }

  // Helper utility function compiling active properties securely
  const getButtonClass = (name, attributes = {}) => {
    return `${styles.toolbarButton} ${editor.isActive(name, attributes) ? styles.buttonActive : ''}`
  }

  return (
    <div className={styles.toolbar}>
      {/* Paragraph */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={getButtonClass('paragraph')}
        title="Paragraph"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 3H9.5a4.5 4.5 0 0 0 0 9H13v9" /><path d="M13 3v9" /></svg>
      </button>

      {/* Heading (H2) */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass('heading', { level: 2 })}
        title="Heading 2"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16" /><path d="M4 18V6" /><path d="M20 18V6" /></svg>
      </button>

      <div className={styles.divider} />

      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass('bold')}
        title="Bold"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h9a4 4 0 0 0 0-8H6v8Z" /><path d="M6 20h10a4 4 0 0 0 0-8H6v8Z" /></svg>
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass('italic')}
        title="Italic"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4" /><line x1="14" x2="5" y1="20" y2="20" /><line x1="15" x2="9" y1="4" y2="20" /></svg>
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={getButtonClass('underline')}
        title="Underline"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" x2="20" y1="21" y2="21" /></svg>
      </button>

      <div className={styles.divider} />

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass('bulletList')}
        title="Bullet List"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
      </button>

      {/* Numbered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass('orderedList')}
        title="Numbered List"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6" /><line x1="10" x2="21" y1="12" y2="12" /><line x1="10" x2="21" y1="18" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" /></svg>
      </button>

      <div className={styles.divider} />

      {/* Link */}
      <button
        onClick={toggleLink}
        className={getButtonClass('link')}
        title="Add Link"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      </button>

      {/* Image */}
      <button
        onClick={addImage}
        className={getButtonClass('image')}
        title="Insert Image"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
      </button>

      <div className={styles.divider} />

      {/* Inline Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={getButtonClass('code')}
        title="Inline Code"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
      </button>

      {/* Code Block */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={getButtonClass('codeBlock')}
        title="Code Block"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m10 10-2 2 2 2" /><path d="m14 14 2-2-2-2" /></svg>
      </button>

      {/* Horizontal Rule */}
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className={styles.toolbarButton} // Always defaults out clean
        title="Horizontal Rule"
      >
        <svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12" /></svg>
      </button>
    </div>
  )
}

// 2. Main Editor Component Layout
export default function ComprehensiveEditor({ content = '', handleUpdate = null }) {

  const timeout = useRef(null);

  // inside ComprehensiveEditor.jsx
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: 'color: #2563eb; text-decoration: underline;',
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => {
        const preview =
          editor.getText().slice(0, 120) +
          (editor.getText().length > 120 ? "..." : "");

        handleUpdate({ content: editor.getJSON(), preview})
      }, 500)
    },
    immediatelyRender: false,
  })

  return (
    <div className={styles.editorWrapper}>
      <MenuBar editor={editor} />
      <div className={styles.contentArea}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
