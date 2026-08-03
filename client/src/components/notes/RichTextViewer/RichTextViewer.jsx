import React, { useMemo } from 'react'
import { generateHTML } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

// Import modular layout definitions
import styles from './RichTextViewer.module.css'

const extensions = [
    StarterKit,
    Underline,
    Image,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            style: 'color: #2563eb; text-decoration: underline;',
        },
    }),
]

// 2. Main Editor Component Layout
export default function RichTextEditor({ content = '' }) {

    const outputHtml = useMemo(() => {
        return generateHTML(content, extensions);
    }, [content]);

    return (
        <div className={styles.viewerWrapper}>
            {/* Safely inject the HTML string into your component */}
            <div dangerouslySetInnerHTML={{ __html: outputHtml }} />
        </div>
    );
}
