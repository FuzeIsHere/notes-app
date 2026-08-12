import React, { useState } from 'react';
import { useUI } from '../../../hooks/useUI';
import { NoteCard } from '../NoteCard/NoteCard';
import { Dropdown } from '../../ui/Dropdown/Dropdown';
import styles from './NotesGrid.module.css';

export const NotesGrid = ({ notes = [], menu }) => {

  const { device, theme } = useUI();
  const [popupTarget, setPopupTarget] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);

  const gridClassName = `${styles.gridContainer} ${styles[device]} ${styles[theme]}`;

  const handleMenuClick = (e, id) => {
    setActiveNoteId(id);
    setPopupTarget(e.currentTarget.getBoundingClientRect());
  };
  const menuOptions = menu(activeNoteId)

  if (notes.length === 0) {
    return (
      <div className={`${styles.emptyStateContainer} ${styles[theme]}`}>
        <p className={styles.emptyStateText}>No notes found. Create a new one to get started!</p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {notes.map(note => (
        <NoteCard
          key={note.id}
          id={note.id}
          title={note.title}
          preview={note.preview}
          category={note.categoryName}
          updated={note.updated}
          pinned={note.pinned}
          onMenuClick={handleMenuClick}
          isMenuOpen={activeNoteId === note.id}
        />
      ))}

      {popupTarget && (
        <Dropdown
          options={menuOptions}
          triggerRect={popupTarget}
          triggerCorner="bottom-right"
          popupCorner="top-right"
          onClose={() => { setPopupTarget(null); setActiveNoteId(null); }}
        />
      )}
    </div>
  );
};
