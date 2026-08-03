
import React, { useState, useEffect, useRef } from 'react'
import NoteNavbar from '../components/notes/NoteNavbar/NoteNavbar'
import { useParams } from 'react-router-dom'
import { getNote, switchCategory, togglePin, updateNote, updateTitle } from '../services/notes.service'
import { useDebounce } from '../hooks/useDebounce'
import RichTextViewer from '../components/notes/RichTextViewer/RichTextViewer'

function ViewNote() {

  const { id } = useParams();

  const [note, setNote] = useState({ title: '', content: [] })
  const [status, setStatus] = useState('Loading');

  useEffect(() => {
    (async () => {
      setNote(await getNote(id))
      setStatus('Saved')
    })()
  }, [])

  // const handleNoteUpdate = async (x) => {
  //   setStatus('Saving...')
  //   setNote(curr => ({ ...curr, ...x }))
  //   await updateNote(id, x);
  //   setStatus('Saved')
  // }

  //const timeoutTitle = useRef(null)
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