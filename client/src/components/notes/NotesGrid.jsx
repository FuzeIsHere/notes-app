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
        <NoteCard key={note.id} {...note} theme={theme} preview={note.content} />
      ))}
    </div>
  );
};
