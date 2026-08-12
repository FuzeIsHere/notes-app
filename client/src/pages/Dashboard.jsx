import React, { useEffect, useState, useRef } from 'react'
import { useUI } from '../hooks/useUI'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

import useNotesStore from '../store/useNotesStore'
import { semanticSearch } from '../services/search.service'
import { getCategories } from '../services/category.service'

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

	const [displayNotes, setDisplayNotes] = useState([])
	const [loading, setLoading] = useState(true)
	
	const [view, setView] = useState({id: "all", type: "system"})

	const menuOptions =
		view.id === 'trash'   ? ['restore', 'delete'] :
		view.id === 'archive' ? ['unarchive', 'trash'] :
							    ['edit', 'archive', 'trash'];

	const currentMenu = useMenu(menuOptions);

	const updateDisplayNotes = async (searched = null) => {
		let copy = [...notes]

		if (searched) copy = searched
		else copy = [...notes]

		if (view.type === 'system') {
			switch (view.id) {
				case 'all': copy = copy.filter(x => !x.archived && !x.deleted); break;
				case 'archive': copy = copy.filter(x => x.archived && !x.deleted); break;
				case 'trash': copy = copy.filter(x => x.deleted); break;
			}
		}
		else {
			copy = copy.filter(x => !x.archived && !x.deleted)
			copy = copy.filter(x => x.categoryId === view.id).map(x => ({...x, categoryName: null}))
		}

		copy.sort((a, b) => {
			if (a.pinned === b.pinned) return b.createdAt - a.createdAt;
			else return a.pinned ? -1 : 1;
		})

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

		const searchFilter = {
			query: c_search,
			categoryId: view.type === 'system' ? null : view.id,
			scope: ['archive', 'trash'].includes(view.id)
				? view.id
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

	}, [notes, search, view]);

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
					active={view}
					setActive={setView}
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
