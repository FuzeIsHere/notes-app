import React, { useRef, useState } from 'react';
import styles from './NoteCard.module.css';
import { useUI } from '../../../hooks/useUI';
import { togglePin } from '../../../services/notes.service';

export const NoteCard = ({
	id,
	title,
	preview = '',
	category = '',
	updatedAt,
	ipinned = false,
	onMenuClick,
	isMenuOpen
}) => {
	const { theme } = useUI();
	const [pinned, setPinned] = useState(ipinned);

	const cardClassName = `${styles.card} ${styles[theme]}`;
	const pinClassName = `${styles.actionButton} ${pinned ? styles.pinActive : ''}`;

	const headerRef = useRef(null);
	const openView = (e) => {
		if (!headerRef.current) return;
		const headerRect = headerRef.current.getBoundingClientRect();
		if (e.clientY <= headerRect.bottom) return;
		window.open(`/notes/${id}`, '_blank', 'noopener,noreferrer');
	};

	const onPinClick = async () => {
		setPinned(await togglePin(id, pinned));
	};

	return (
		<div className={cardClassName} onClick={openView}>
			<div className={styles.headerRow} onClick={e => e.stopPropagation()} ref={headerRef}>
				<div className={styles.titleContainer}>
					<button
						className={pinClassName}
						onClick={onPinClick}
						aria-label={pinned ? "Unpin note" : "Pin note"}
					>
						<svg width="15" height="15" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="12" y1="17" x2="12" y2="22"></line>
							<path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.32-2.9A2 2 0 0 1 15.8 9.86V5a1 1 0 0 0-1-1h-5.6a1 1 0 0 0-1 1v4.86c0 .42-.13.83-.38 1.15l-2.31 2.9a2 2 0 0 0-.44 1.24Z"></path>
						</svg>
					</button>
					<h3 className={styles.title}>{title || "Untitled Note"}</h3>
				</div>

				<button
					className={`${styles.actionButton} ${isMenuOpen ? styles.activeTrigger : ''}`}
					onClick={(e) => onMenuClick(e, id)}
					aria-label="More options"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="1"></circle>
						<circle cx="12" cy="5" r="1"></circle>
						<circle cx="12" cy="19" r="1"></circle>
					</svg>
				</button>
			</div>

			<p className={styles.preview}>{preview}</p>

			<div className={styles.footerRow}>
				{category && (
					<div className={styles.categoryTag}>
						<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
						</svg>
						<span>{category}</span>
					</div>
				)}
				<span className={styles.timestamp}>
					{updatedAt && typeof updatedAt.toDate === 'function' 
						? updatedAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
						: ''}
				</span>
			</div>
		</div>
	);
};
