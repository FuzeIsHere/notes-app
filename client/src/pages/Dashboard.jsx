import React, { useEffect, useState, useRef } from 'react'
import { useUI } from '../hooks/useUI'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

import useNotesStore from '../store/useNotesStore'
import { semanticSearch } from '../services/search.service'

import Navbar from '../components/ui/Navbar/Navbar'
import { Sidebar } from '../components/ui/Sidebar/Sidebar'
import { NotesGrid } from '../components/notes/NotesGrid/NotesGrid'
import { useMenu } from '../hooks/useMenu'
import Loading from './Loading'

import { useDebounce } from '../hooks/useDebounce'

const Dashboard = () => {
	const navigate = useNavigate();
	const { device, theme } = useUI();
	const [showSide, setShowSide] = useState(device === 'desktop');

	const notes = useNotesStore(state => state.notes)
	const refresh = useNotesStore(state => state.actions.refresh);
	const addNote = useNotesStore(state => state.actions.addNote);

	const [search, setSearch] = useState('');

	const searchId = useRef(0);
	const [selectedView, setSelectedView] = useState('all')
	const [displayNotes, setDisplayNotes] = useState([])
	const [loading, setLoading] = useState(true)

	const sidebarItems = [
		{ id: "all", label: "All Notes", type: "system" },
		{ id: "work", label: "Work", type: "category" },
		{ id: "personal", label: "Personal", type: "category" },
		{ id: "ideas", label: "Ideas", type: "category" },
		{ id: "archive", label: "Archive", type: "system" },
		{ id: "trash", label: "Trash", type: "system" },
	];

	const menuOptions =
		selectedView === 'trash' ? ['restore', 'delete'] :
			selectedView === 'archive' ? ['unarchive', 'trash'] :
				['edit', 'archive', 'trash'];

	const currentMenu = useMenu(menuOptions);

	const updateDisplayNotes = async (searched = null) => {
		let copy = [...notes]

		if (searched) copy = searched
		else copy = [...notes]

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

		//copy = copy.map(x => ({id: x.id}))
		setDisplayNotes(copy)
		setLoading(false)
	}

	useEffect(() => {
		refresh();
	}, [])

	const debounce = useDebounce(500)
	useEffect(() => {
		const currentSearchId = ++searchId.current;
		const c_search = search.trim();

		if (!c_search) {
			updateDisplayNotes();
			return;
		}

		const viewFilter = sidebarItems.find(x => x.id === selectedView);

		const searchFilter = {
			query: c_search,
			category: viewFilter.type === 'system' ? 'all' : viewFilter.id,
			scope: ['archive', 'trash'].includes(viewFilter.id)
				? viewFilter.id
				: 'all',
		};

		const temp = async () => {
			setLoading(true);
			if (currentSearchId !== searchId.current) {setLoading(false); return}
			const search_data = await semanticSearch(searchFilter);
			if (currentSearchId !== searchId.current) {setLoading(false); return}
			setDisplayNotes(search_data);
			setLoading(false);
		};

		debounce(temp);

	}, [notes, search, selectedView]);

	const handleCreateNote = async () => {
		//console.log(typeof addNote, addNote)
		const id = await addNote();
		navigate(`/notes/${id}/edit`);
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
				buttons={[{ name: 'Note', event: handleCreateNote }]}
			/>
			<div style={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
				<Sidebar
					isOpen={showSide}
					onClose={() => setShowSide(false)}
					active={selectedView}
					setActive={setSelectedView}
				/>
				{!loading ? (
					<NotesGrid notes={displayNotes} menu={currentMenu} />
				) : (
					<div style={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', color: textClr }}>
						<Loading />
					</div>
				)}
			</div>
		</div>
	)
}

export default Dashboard
