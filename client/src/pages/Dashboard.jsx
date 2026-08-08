import React, { useEffect, useState } from 'react'
import { useUI } from '../hooks/useUI'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

import { getNotes, createNote } from '../services/notes.service'
import useNotesStore from '../store/useNotesStore'

import Navbar from '../components/ui/Navbar/Navbar'
import { Sidebar } from '../components/ui/Sidebar/Sidebar'
import { NotesGrid } from '../components/notes/NotesGrid/NotesGrid'

const Dashboard = () => {
  const navigate = useNavigate();
  const { device, theme } = useUI();
  const [showSide, setShowSide] = useState(device === 'desktop');

  const notes = useNotesStore(state => state.notes)

  const refresh = useNotesStore(state => state.actions.refresh);
  const archive = useNotesStore(state => state.actions.archive);
  const unarchive = useNotesStore(state => state.actions.unarchive);
  const moveToTrash = useNotesStore(state => state.actions.moveToTrash);
  const restoreFromTrash = useNotesStore(state => state.actions.restoreFromTrash);
  const permanentlyDelete = useNotesStore(state => state.actions.permanentlyDelete);

  const [search, setSearch] = useState('');

  const sidebarItems = [
    { id: "all", label: "All Notes", type: "system" },
    { id: "work", label: "Work", type: "category" },
    { id: "personal", label: "Personal", type: "category" },
    { id: "ideas", label: "Ideas", type: "category" },
    { id: "archive", label: "Archive", type: "system" },
    { id: "trash", label: "Trash", type: "system" },
  ];


  const menuMaker = (keys) => {
    //const s = key => useNotesStore(state => state[key])
    const menuOptions = {
      edit: id => ({ label: 'Edit', action: () => window.open(`/notes/${id}/edit`, '_blank', 'noopener,noreferrer') }),
      archive: id => ({ label: 'Archive', action: async () => { await archive(id); } }),
      unarchive: id => ({ label: 'Unarchive', action: async () => { await unarchive(id); } }),
      trash: id => ({ label: 'Delete', action: async () => { await moveToTrash(id); } }),
      restore: id => ({ label: 'Restore', action: async () => { await restoreFromTrash(id); } }),
      delete: id => ({ label: 'Permanently delete', action: async () => { await permanentlyDelete(id); } }),
    };
    return (id) => {
      let menu = []
      for (const key of keys) menu.push((menuOptions[key])(id))
      return menu
    }
  }


  const [selectedView, setSelectedView] = useState('all')
  const [displayNotes, setDisplayNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const getMenu = () => {
    switch (selectedView) {
      case 'archive': return menuMaker(['unarchive', 'trash']);
      case 'trash': return menuMaker(['restore', 'delete']);
      default: return menuMaker(['edit', 'archive', 'trash'])
    }
  }
  const updateDisplayNotes = async () => {
    let copy = [...notes]
    const viewFilter = sidebarItems.find(x => x.id === selectedView)

    if (!['archive', 'trash'].includes(viewFilter.id)) {
      copy = copy.filter(x => !x.archived && !x.deleted)
      if (viewFilter.type === 'category') {
        copy = copy.filter(x => x.category === viewFilter.id)
      }
    }
    else {
      switch (viewFilter.id) {
        case 'archive': copy = copy.filter(x => x.archived && !x.deleted); break;
        case 'trash': copy = copy.filter(x => x.deleted); break;
      }
    }

    copy.sort((a, b) => {
      if (a.pinned === b.pinned) return b.createdAt - a.createdAt;
      else return a.pinned ? -1 : 1;
    })

    copy = copy.map(x => ({id: x.id}))
    setDisplayNotes(copy)
    setLoading(false)
  }

  useEffect(() => {
    refresh();
  }, [])

  useEffect(() => {
    updateDisplayNotes()
  }, [notes, search, selectedView])

  const handleCreateNote = async () => {
    const { id } = await useNotesStore(state => state.addNote)();
    window.open(`/notes/${id}/edit`, '_blank', 'noopener,noreferrer');
  }

  // Dynamic variable styles mapping dark and light variants natively
  const isDark = theme === 'dark';
  const pageBg = isDark ? '#121214' : '#fbfbfb';
  const textClr = isDark ? '#a1a1aa' : '#71717a';

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: pageBg, transition: 'background-color 0.2s ease' }}>
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
        {!loading ? (
          <NotesGrid notes={displayNotes} menu={getMenu()} />
        ) : (
          <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', color: textClr }}>
            <p>Loading your space...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
