import React, { useRef, useState } from 'react';
import styles from './NoteCard.module.css';

import { Link, useNavigate } from 'react-router-dom';
import { useUI } from '../../../hooks/useUI';
import { archiveNote, deleteNote, moveToTrash, togglePin } from '../../../services/notes.service';

import { Dropdown } from '../../ui/Dropdown/Dropdown';

export const NoteCard = ({
	id,
	title,
	preview = '',
	category = '',
	updatedAt,
	ipinned = false
}) => {
	const { theme } = useUI();
	const navigate = useNavigate();
	const [pinned, setPinned] = useState(ipinned);
	const isDark = theme === 'dark';
	const cardClassName = `${styles.card} ${isDark ? styles.dark : styles.light}`;
	const pinClassName = `${styles.actionButton} ${pinned ? styles.pinActive : ''}`;

	const headerRef = useRef(null);
	const openView = (e) => {
		if (!headerRef.current) return;
		const headerRect = headerRef.current.getBoundingClientRect();
		if (e.clientY <= headerRect.bottom) return;
		window.open(`/notes/${id}`, '_blank', 'noopener,noreferrer');
	}

	const onPinClick = async () => {
		setPinned(await togglePin(id, pinned));
	}

	const [popupTarget, setPopupTarget] = useState(null);

	const handleThreeDotsClick = (e) => {
		// Capture the target element's exact screen size and position parameters
		setPopupTarget(e.currentTarget.getBoundingClientRect());
	};
	const menuOptions = [
		{ label: 'Edit', action: () => window.open(`/notes/${id}/edit`, '_blank', 'noopener,noreferrer') },
		{
			label: 'Archive', action: async () => {
				await archiveNote(id);
			}
		},
		{
			label: 'Move to Trash', action: async () => {
				await moveToTrash(id);
			}
		},
		{
			label: 'Delete', action: async () => {
				await deleteNote(id);
			}
		},
	];

	return (
		<div className={cardClassName} onClick={openView}>
			{/* Top Header Row */}
			<div className={styles.headerRow} onClick={e => e.stopPropagation()} ref={headerRef}>
				<div className={styles.titleContainer}>
					{/* Pin Button */}
					<button
						className={pinClassName}
						onClick={onPinClick}
						aria-label={pinned ? "Unpin note" : "Pin note"}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="12" y1="17" x2="12" y2="22"></line>
							<path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.32-2.9A2 2 0 0 1 15.8 9.86V5a1 1 0 0 0-1-1h-5.6a1 1 0 0 0-1 1v4.86c0 .42-.13.83-.38 1.15l-2.31 2.9a2 2 0 0 0-.44 1.24Z"></path>
						</svg>
					</button>
					<h3 className={styles.title}>{title}</h3>
				</div>

				{/* Three Dots More Options Button */}
				<button
					className={styles.actionButton}
					onClick={handleThreeDotsClick}
					aria-label="More options"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="1"></circle>
						<circle cx="12" cy="5" r="1"></circle>
						<circle cx="12" cy="19" r="1"></circle>
					</svg>
				</button>
			</div>

			{/* Popup menu */}
			{popupTarget && (
				<Dropdown
					options={menuOptions}
					triggerRect={popupTarget}
					triggerCorner="bottom-right" // Spawns from bottom right of the 3 dots
					popupCorner="top-right"      // Aligns top-right of popup to that anchor
					onClose={() => setPopupTarget(null)}
				/>
			)}

			{/* Main Content Body Preview */}
			<p className={styles.preview}>{preview}</p>

			{/* Bottom Footer Row */}
			<div className={styles.footerRow}>
				<div className={styles.categoryTag}>
					{/* Folder tag icon */}
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
					</svg>
					<span>{category}</span>
				</div>
				<span className={styles.timestamp}>{updatedAt.toDate().toLocaleString()}</span>
			</div>
		</div>
	);
};
