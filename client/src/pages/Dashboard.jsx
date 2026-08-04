import React, { useEffect, useState } from 'react'
import { useUI } from '../hooks/useUI'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { getNotes, createNote } from '../services/notes.service'

import Navbar from '../components/ui/Navbar/Navbar'
import { Sidebar } from '../components/ui/Sidebar/Sidebar'
import { NotesGrid } from '../components/notes/NotesGrid/NotesGrid'

const Dashboard = () => {
  const navigate = useNavigate();

  const { device } = useUI();
  const [showSide, setShowSide] = useState(device === 'desktop');

  const [notes, setNotes] = useState([])

  const [search, setSearch] = useState('');
  const sidebarItems = [
    { id: "all", label: "All Notes", type: "system" },
    // { id: "fav", label: "Favourites", type: "system" },
    { id: "work", label: "Work", type: "category" },
    { id: "personal", label: "Personal", type: "category" },
    { id: "ideas", label: "Ideas", type: "category" },
    { id: "archive", label: "Archive", type: "system" },
    { id: "trash", label: "Trash", type: "system" },
  ];
  const [selectedView, setSelectedView] = useState('all')

  const [displayNotes, setDisplayNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const updateDisplayNotes = async () => {
    let copy = [...notes]
    
    const viewFilter = sidebarItems.find(x => x.id === selectedView)
    if(viewFilter.type === 'category') copy = copy.filter(x => x.category === viewFilter.id)
    else{
      switch(viewFilter.id){
        case 'archive': copy = copy.filter(x => x.isArchive); break;
        case 'trash': copy = copy.filter(x => x.isDeleted); break;
      }
    }

    copy.sort((a, b) => {
      if (a.isPinned == b.isPinned) return b.createdAt - a.createdAt;
      else return a.isPinned ? -1 : 1;
    })
    setDisplayNotes(copy)
    setLoading(false)
  }


  useEffect(() => {
    const temp = async () => {
      const data = await getNotes();
      setNotes(data)
    }
    temp();
  }, [])

  useEffect(() => {
    updateDisplayNotes()
  }, [notes, search, selectedView])

  const handleCreateNote = async () => {
    const { id } = await createNote({});
    //navigate(`/notes/${id}/edit`)
    window.open(`/notes/${id}/edit`, '_blank', 'noopener,noreferrer');
  }

  //if(loading) return <p>Loading...</p>

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar
        search={search} setSearch={setSearch}
        setShowSide={setShowSide}
        buttons={[{ name: '+ Note', event: handleCreateNote }]}
      />
      <div style={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
        <Sidebar
          isOpen={showSide}
          onClose={() => setShowSide(false)}
          active={selectedView}
          setActive={setSelectedView}
        />
        {!loading ? <NotesGrid notes={displayNotes} /> : <p>Loading</p>}
      </div>
    </div>

  )
}

export default Dashboard