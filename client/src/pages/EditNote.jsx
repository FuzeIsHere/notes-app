import React, { useState, useEffect, useRef } from 'react'
import NoteEditNavbar from '../components/notes/NoteEditNavbar/NoteEditNavbar'
import { useParams } from 'react-router-dom'
import { getNote, switchCategory, togglePin, updateNote, updateTitle } from '../services/notes.service'
import RichTextEditor from '../components/notes/RichTextEditor/RichTextEditor'
import { useDebounce } from '../hooks/useDebounce'

function EditNote() {

  const { id } = useParams();

  const [note, setNote] = useState({ title: '', content: [] })
  const [status, setStatus] = useState('Loading');

  useEffect(() => {
    (async () => {
      setNote(await getNote(id))
      setStatus('Saved')
    })()
  }, [])

  const debounceContent = useDebounce(500);
  const handleContentUpdate = async (x) => {
    setNote(curr => ({ ...curr, ...x }))
    setStatus('Saving...')

    debounceContent(async () => {
      await updateNote(id, x);
      setStatus('Saved')
    })
  }

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
      await switchCategory(id, category)
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
    return <p></p>
  }
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <NoteEditNavbar
        id={id}
        title={note.title}
        setTitle={changeTitle}

        category={note.category}
        onCategoryChange={changeCategory}

        isPinned={note.isPinned}
        onTogglePin={changePinnedStatus}

        saveStatus={status}
      />
      <RichTextEditor content={note.content} handleUpdate={handleContentUpdate} />
    </div>
  )
}

export default EditNote