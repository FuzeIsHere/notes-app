import React from 'react';
import { useUI } from '../../hooks/useUI';
import { NoteCard } from './NoteCard';
import styles from './NotesGrid.module.css';

export const NotesGrid = ({ notes }) => {
  const { device, theme } = useUI(); // Returns 'mobile', 'tablet', or 'desktop'

  // Combine base styles with explicit device context modifier class
  const gridClassName = `${styles.gridContainer} ${styles[device]}`;

  return (
    <div className={gridClassName}>
      {notes.map(note => (
        <NoteCard key={note.id} title={note.title} preview={note.preview}
        category={note.category}
        updatedAt={note.updatedAt}
        ipinned={note.isPinned}
          />
      ))}
    </div>
  );
};
