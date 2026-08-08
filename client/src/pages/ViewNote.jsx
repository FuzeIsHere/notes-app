import React, { useState, useEffect } from 'react'
import NoteNavbar from '../components/notes/NoteNavbar/NoteNavbar'
import { useParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import RichTextViewer from '../components/notes/RichTextViewer/RichTextViewer'
import { useUI } from '../hooks/useUI'

import useNotesStore from '../store/useNotesStore'

function ViewNote() {
  const { id } = useParams();
  const { theme } = useUI();

  const [note, setNote] = useState({ title: '', content: [] })
  const [status, setStatus] = useState('Loading');

  const isStoreLoading = useNotesStore(state => state.loading);

  const {
    read,
    setTitle,
    setCategory,
    pin,
    unpin,
  } = useNotesStore(x => x.actions);

  useEffect(() => {
    (async () => {
      setNote(await read(id))
      setStatus('Saved')
    })()
  }, [])

  const debounceTitle = useDebounce(500);
  const changeTitle = async (title) => {
    setNote(x => ({ ...x, title: title }));
    setStatus('Saving...');
    debounceTitle(async () => {
      await setTitle(id, title);
      setStatus('Saved');
    });
  };

  const debounceCategory = useDebounce(500);
  const changeCategory = async (category) => {
    setNote(x => ({ ...x, category: category }));
    setStatus('Saving...');
    debounceCategory(async () => {
      await setCategory(id, category);
      setStatus('Saved');
    });
  };

  const debouncePin = useDebounce(500);
  const changePinnedStatus = async () => {
    const nextPinnedValue = !note.pinned;
    setNote(x => ({ ...x, pinned: nextPinnedValue }));
    setStatus('Saving...');
    debouncePin(async () => {
      if (note.pinned) {
        await unpin(id);
      } else {
        await pin(id);
      }
      setStatus('Saved');
    });
  };

  if (status === 'Loading') {
    return null
  }

  const isDark = theme === 'dark';
  const pageBg = isDark ? '#111113' : '#ffffff';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: pageBg, transition: 'background-color 0.2s ease' }}>
      <NoteNavbar
        id={id}
        title={note.title}
        setTitle={changeTitle}
        category={note.category}
        onCategoryChange={changeCategory}
        isPinned={note.pinned}
        onTogglePin={changePinnedStatus}
      />
      <RichTextViewer content={note.content} />
    </div>
  )
}

export default ViewNote
