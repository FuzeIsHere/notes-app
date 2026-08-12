import React, { useState, useEffect } from 'react'
import NoteNavbar from '../components/notes/NoteNavbar/NoteNavbar'
import { useParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import RichTextViewer from '../components/notes/RichTextViewer/RichTextViewer'
import { useUI } from '../hooks/useUI'

import useNotesStore from '../store/useNotesStore'

import { useMenu } from '../hooks/useMenu'
import NotFound from './NotFound'
import Loading from './Loading'

import { getCategories } from '../services/category.service'

function ViewNote() {
  const { id } = useParams();
  const { theme } = useUI();

  const [note, setNote] = useState({ title: '', content: [], archived: true, deleted: true })
  const [status, setStatus] = useState('Loading');

  const notes = useNotesStore(state => state.notes)
  const isStoreLoading = useNotesStore(state => state.loading);
  const menuOptions =
    note.deleted ? ['restore', 'delete'] :
      note.archived ? ['unarchive', 'trash'] :
        ['edit', 'archive', 'trash'];

  const currentMenu = useMenu(menuOptions);

  const {
    read,
    setTitle,
    setCategory,
    pin,
    unpin,
  } = useNotesStore(x => x.actions);

  useEffect(() => {
    (async () => {
      const data = await read(id)
      if (!data) {
        setStatus('Not found')
        return;
      }
      setNote(data)
      setStatus('Saved')
    })()
  }, [notes])


  const [categories, setCategories] = useState([{ name: 'General', id: 'x' }]);

  useEffect(() => {
    const temp = async () => {
      let categories = await getCategories()
      setCategories(categories)
    }
    temp();
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
    setNote(x => ({ ...x, categoryName: category.name, categoryId: category.id }));
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
    return <Loading />
  }

  if (status === 'Not found') {
    return <NotFound msg={'Unable to find note.'} showFor={2000} to={`/dashboard`} />
  }

  const isDark = theme === 'dark';
  const pageBg = isDark ? '#111113' : '#ffffff';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: pageBg, transition: 'background-color 0.2s ease' }}>
      <NoteNavbar
        id={id}
        title={note.title}
        setTitle={changeTitle}
        categoryId={note.categoryId}
        onCategoryChange={changeCategory}
        categoriesList={categories}
        pinned={note.pinned}
        onTogglePin={changePinnedStatus}
        menuOptions={currentMenu(id)}
      />
      <RichTextViewer content={note.content} />
    </div>
  )
}

export default ViewNote
