import React, { useState } from 'react';
import styles from './NoteNavbar.module.css';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../../../hooks/useUI';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';
import { Dropdown } from '../../ui/Dropdown/Dropdown';

const NoteNavbar = ({
	id,
	title = '',
	setTitle = null,
	category = '',
	onCategoryChange = null,
	categoriesList = ['Personal', 'Work', 'Ideas'], 
	isPinned = false,
	onTogglePin = null,
	onDelete = null,
	setShowSide = null,
}) => {
	const navigate = useNavigate();
	const { device, theme } = useUI();
	const { user } = useAuth();

	const [popupTarget, setPopupTarget] = useState(null);

	const handleThreeDotsClick = (e) => {
		setPopupTarget(e.currentTarget.getBoundingClientRect());
	};

	const menuOptions = [
		{ label: 'Edit', action: () => navigate(`/notes/${id}/edit`) },
		{ label: 'Archive', action: async () => {} },
		{ label: 'Move to Trash', action: async () => {} },
		{ label: 'Delete', action: async () => {} },
	];

	return (
		<header className={`${styles.navbar} ${styles[theme]}`}>
			<div className={styles.navContainer}>

				<div className={styles.leftSection}>
					{device === 'mobile' && setShowSide && (
						<button
							type="button"
							className={styles.menuButton}
							onClick={() => setShowSide(x => !x)}
							aria-label="Toggle custom sidebar"
						>
							☰
						</button>
					)}
					<Link to="/dashboard" className={styles.backLink} title="Back to dashboard">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
					</Link>
					{device !== 'mobile' && <span className={styles.logo}>CoNotate</span>}
				</div>

				<div className={styles.titleContainer}>
					<input
						type="text"
						id="note-title-input"
						placeholder="Untitled Note"
						value={title}
						onChange={(e) => setTitle?.(e.target.value)}
						className={styles.titleInput}
					/>
					
					<div className={styles.categoryWrapper}>
						<select
							className={styles.categorySelect}
							value={category}
							onChange={(e) => onCategoryChange?.(e.target.value)}
							aria-label="Change category"
						>
							<option value="" disabled hidden>Category</option>
							{categoriesList.map(cat => (
								<option key={cat} value={cat.toLowerCase()}>{cat}</option>
							))}
						</select>
					</div>

					<button
						type="button"
						className={`${styles.actionIconButton} ${isPinned ? styles.pinnedButton : ''}`}
						onClick={onTogglePin}
						title={isPinned ? "Unpin note" : "Pin note"}
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="17" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.12-2.6A2 2 0 0 1 16 10.16V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6.16a2 2 0 0 1-.44 1.24l-2.12 2.6a2 2 0 0 0-.44 1.24Z" /></svg>
					</button>
				</div>

				<div className={styles.rightSection}>
					{onDelete && (
						<button
							type="button"
							className={styles.deleteButton}
							onClick={onDelete}
							title="Delete note"
						>
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
						</button>
					)}

					<button
						className={`${styles.actionIconButton} ${popupTarget ? styles.activeTrigger : ''}`}
						onClick={handleThreeDotsClick}
						title="More options"
						aria-label="More options"
					>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
					</button>

					{popupTarget && (
						<Dropdown
							options={menuOptions}
							triggerRect={popupTarget}
							triggerCorner="bottom-right"
							popupCorner="top-right"
							onClose={() => setPopupTarget(null)}
						/>
					)}

					{device !== 'mobile' && (
						<>
							{!!user ? (
								<button type="button" className={styles.avatarButton} aria-label="User profile">
									<img
										className={styles.avatarImg}
										src="https://unsplash.com"
										alt="User avatar"
									/>
								</button>
							) : (
								<Button variant="primary" size="sm">Log In</Button>
							)}
						</>
					)}
				</div>

			</div>
		</header>
	);
};

export default NoteNavbar;
