import React, { useState, useEffect } from 'react'
import NoteNavbar from '../components/notes/NoteNavbar/NoteNavbar'
import { useParams } from 'react-router-dom'
import { getNote, updateCategory, togglePin, updateTitle } from '../services/notes.service'
import { useDebounce } from '../hooks/useDebounce'
import RichTextViewer from '../components/notes/RichTextViewer/RichTextViewer'
import { useUI } from '../hooks/useUI'

function ViewNote() {
  const { id } = useParams();
  const { theme } = useUI();

  const [note, setNote] = useState({ title: '', content: [] })
  const [status, setStatus] = useState('Loading');

  useEffect(() => {
    (async () => {
      setNote(await getNote(id))
      setStatus('Saved')
    })()
  }, [])

  const dedounceTitle = useDebounce(500)
  const changeTitle = async (title) => {
    setNote(x => ({ ...x, title: title }))
    setStatus('Saving...')

    dedounceTitle(async () => {
      await updateTitle(id, title)
      setStatus('Saved')
    })
  }

  const dedounceCategory = useDebounce(500)
  const changeCategory = async (category) => {
    setNote(x => ({ ...x, category: category }))
    setStatus('Saving...')
    dedounceCategory(async () => {
      await updateCategory(id, category)
      setStatus('Saved')   
    })
  }

  const dedouncePin = useDebounce(500)
  const changePinnedStatus = async () => {
    setNote(x => ({ ...x, isPinned: !x.isPinned }))
    setStatus('Saving...')
    dedouncePin(async () => {
      await togglePin(id, note.isPinned)
      setStatus('Saved')
    })
  }

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
        isPinned={note.isPinned}
        onTogglePin={changePinnedStatus}
      />
      <RichTextViewer content={note.content} />
    </div>
  )
}

export default ViewNote
