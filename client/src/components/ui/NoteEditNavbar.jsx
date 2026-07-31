import React from 'react';
import styles from './NoteEditNavbar.module.css';
import { Button } from './Button';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
const NoteEditNavbar = ({
	title = '',
	setTitle = null,
	isSaving = false, // true = "Saving...", false = "Saved"
	saveStatus = 'unsaved',
	onDelete = null,
	setShowSide = null
}) => {
	const { device } = useUI();
	const { user } = useAuth();

	return (
		<header className={styles.navbar}>
			<div className={styles.navContainer}>

				{/* LEFT SECTION: Contextual triggers & Identity */}
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
						<svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
					</Link>
					{device !== 'mobile' && <span className={styles.logo}>CoNotate</span>}
				</div>

				{/* CENTER SECTION: Dynamic Note Title Input & Sync Indicators */}
				<div className={styles.titleContainer}>
					<input
						type="text"
						id="note-title-input"
						placeholder="Untitled Note"
						value={title}
						onChange={(e) => setTitle?.({title: e.target.value})}
						className={styles.titleInput}
					/>
					<span className={`${styles.statusIndicator} ${isSaving ? styles.saving : styles.saved}`}>
						{saveStatus}
					</span>
				</div>

				{/* RIGHT SECTION: Save actions & User controls */}
				<div className={styles.rightSection}>
					{onDelete && (
						<button 
							type="button" 
							className={styles.deleteButton} 
							onClick={onDelete}
							title="Delete note"
						>
							<svg xmlns="http://w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
						</button>
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

export default NoteEditNavbar;
