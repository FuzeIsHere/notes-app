import React, { useMemo } from 'react'
import { generateHTML } from '@tiptap/react'
import { useUI } from '../../../hooks/useUI'

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

import styles from './RichTextViewer.module.css'

const extensions = [
    StarterKit,
    Underline,
    Image,
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: styles.viewerLink,
        },
    }),
]

export default function RichTextEditor({ content = '' }) {
    const { theme } = useUI()

    const outputHtml = useMemo(() => {
        return generateHTML(content, extensions);
    }, [content]);

    return (
        <div className={`${styles.viewerWrapper} ${styles[theme]}`}>
            <div dangerouslySetInnerHTML={{ __html: outputHtml }} className={styles.renderedContent} />
        </div>
    );
}
