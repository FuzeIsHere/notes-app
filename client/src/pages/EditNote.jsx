import React, { useState, useEffect } from 'react'
import NoteEditNavbar from '../components/notes/NoteEditNavbar/NoteEditNavbar'
import { useParams } from 'react-router-dom'
import RichTextEditor from '../components/notes/RichTextEditor/RichTextEditor'
import { useDebounce } from '../hooks/useDebounce'
import { useUI } from '../hooks/useUI'
import useNotesStore from '../store/useNotesStore'
import NotFound from './NotFound'
import Loading from './Loading'

import { getCategories } from '../services/category.service'

function EditNote() {
  const { id } = useParams();
  const { theme } = useUI();

  const notesInStore = useNotesStore(state => state.notes);
  const isStoreLoading = useNotesStore(state => state.loading);

  const {
    refresh,
    read,
    setCategory,
    pin,
    unpin,
    changeInNote,
    setTitle
  } = useNotesStore(x => x.actions);

  const [note, setNote] = useState({ title: '', content: [], pinned: false, category: '' });
  const [saveStatus, setSaveStatus] = useState('Saved');

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (!isStoreLoading) {
        const existingNote = await read(id);
        setNote(existingNote);
        setIsReady(true);
      }
    }
    initialize()
  }, [id, isStoreLoading, read, notesInStore]);

  const [categories, setCategories] = useState([{ name: 'General', id: 'x' }]);

  useEffect(() => {
    const temp = async () => {
      let categories = await getCategories()
      setCategories(categories)
    }
    temp();
  }, [])

  // --- Handlers ---
  const handleContentUpdate = async (x) => {
    setNote(curr => ({ ...curr, ...x }));
    await changeInNote(id, x);
    setSaveStatus('Saved');
  };

  const debounceTitle = useDebounce(500);
  const changeTitle = async (title) => {
    setNote(x => ({ ...x, title: title }));
    setSaveStatus('Saving...');
    debounceTitle(async () => {
      await setTitle(id, title);
      setSaveStatus('Saved');
    });
  };

  const debounceCategory = useDebounce(500);
  const changeCategory = async (category) => {
    setNote(x => ({ ...x, categoryName: category.name, categoryId: category.id }));
    setSaveStatus('Saving...');
    debounceCategory(async () => {
      await setCategory(id, category);
      setSaveStatus('Saved');
    });
  };

  const debouncePin = useDebounce(500);
  const changePinnedStatus = async () => {
    const nextPinnedValue = !note.pinned;
    setNote(x => ({ ...x, pinned: nextPinnedValue }));
    setSaveStatus('Saving...');
    debouncePin(async () => {
      if (note.pinned) {
        await unpin(id);
      } else {
        await pin(id);
      }
      setSaveStatus('Saved');
    });
  };

  // 3. Conditional UI Rendering Guards
  if (!isReady || (isStoreLoading && notesInStore.length === 0)) {
    return <Loading />; // Stays clean while background fetch runs
  }

  if (!note) {
    return <NotFound msg={'Unable to find note.'} showFor={2000} to={`/dashboard`} />
  }

  if (note.archived) {
    return <NotFound msg={'Unarchive the note to edit.'} showFor={4000} to={`/notes/${id}`} />
  }

  if (note.deleted) {
    return <NotFound msg={'Restore the note to edit.'} showFor={4000} to={`/notes/${id}`} />
  }

  const isDark = theme === 'dark';
  const pageBg = isDark ? '#111113' : '#ffffff';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: pageBg, transition: 'background-color 0.2s ease' }}>
      <NoteEditNavbar
        id={id}
        title={note.title}
        setTitle={changeTitle}
        categoryId={note.categoryId}
        onCategoryChange={changeCategory}
        categoriesList={categories}
        isPinned={note.pinned}
        onTogglePin={changePinnedStatus}
        saveStatus={saveStatus}
      />
      <RichTextEditor content={note.content} handleUpdate={handleContentUpdate} setStatus={setSaveStatus} />
    </div>
  );
}

export default EditNote;
