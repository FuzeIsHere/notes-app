note = {
    ownerId: "...",

    collaborators: [],

    title: "Shopping",

    content: { /*...TipTap JSON...*/ },

    preview: '',

    category: "Personal",

    pinned: false,

    archived: false,

    deleted: false,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp()
}

This navbar is for the editor of a react notes app. Make this navbar additionally support changing category and pinning. Also add a three dot button (no dropdown popup, i will make it on my own). Also make it support, dark/light theme, it extracts the theme variable form useUI hook.

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


.navbar {
  width: 100%;
  height: 60px;
  min-height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 50;
  font-family: system-ui, -apple-system, sans-serif;
}

.navContainer {
  height: 100%;
  margin: 0 auto;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.leftSection {
  display: flex;
  align-items: center;
  gap: 12px;
}

.menuButton {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #374151;
  display: flex;
  align-items: center;
}

.backLink {
  color: #4b5563;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.backLink:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.logo {
  font-weight: 700;
  font-size: 1.1rem;
  color: #9ca3af;
  text-decoration: none;
  letter-spacing: -0.025em;
}

/* Center Section Layout Elements */
.titleContainer {
  flex: 1;
  max-width: 600px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.titleInput {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  border: none;
  background: transparent;
  padding: 6px 0;
  width: 100%;
}

.titleInput:focus {
  outline: none;
  border-bottom: 1px solid #e5e7eb;
}

.titleInput::placeholder {
  color: #9ca3af;
}

/* Save Sync Indicator Statuses */
.statusIndicator {
  font-size: 0.8rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

.saved {
  color: #10b981;
  background-color: #ecfdf5;
}

.saving {
  color: #f59e0b;
  background-color: #fffbeb;
}

/* Right Side Actions Alignment */
.rightSection {
  display: flex;
  align-items: center;
  gap: 14px;
}

.deleteButton {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.deleteButton:hover {
  color: #ef4444;
  background-color: #fef2f2;
}

.avatarButton {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
}

.avatarImg {
  height: 32px;
  width: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}