import React, { useState, useEffect, useRef } from 'react'
import RichTextEditor from '../components/notes/RichTextEditor'
import NoteEditNavbar from '../components/ui/NoteEditNavbar'
import { useParams } from 'react-router-dom'
import { getNote, updateNote } from '../services/notes.service'

function EditNote() {

  const { id } = useParams();

  const [note, setNote] = useState({ title: '', content: [] })
  const [status, setStatus] = useState('Loading');

  useEffect(() => {
    (async () => {
      setNote(await getNote(id))
      setStatus('Saved')
      console.log(status, note)
    })()
  }, [])

  const handleNoteUpdate = async (x) => {
    setStatus('Saving...')
    setNote(curr => ({...curr, ...x}))
    await updateNote(id, x);
    setStatus('Saved')
  }

  if(status === 'Loading'){
    return <p>Loading...</p>
  }
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <NoteEditNavbar title={note.title} setTitle={handleNoteUpdate} saveStatus={status} isSaving={status !== 'Saved'}/>
      <RichTextEditor content={note.content} handleUpdate={handleNoteUpdate} />
    </div>
  )
}

export default EditNote