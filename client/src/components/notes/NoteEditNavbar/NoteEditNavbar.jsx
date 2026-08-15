import React, { useState, useEffect, useRef } from 'react';
import styles from './NoteEditNavbar.module.css';
import { useUI } from '../../../hooks/useUI';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button/Button';

const NoteEditNavbar = ({
	id,
	title = '',
	setTitle = null,
	categoryId = '',
	onCategoryChange = null,
	categoriesList = [{ name: "General", id: "x" }],
	isPinned = false,
	onTogglePin = null,
	saveStatus = 'unsaved',
	onDelete = null,
	setShowSide = null,
}) => {
	const { device, theme } = useUI();
	const { user } = useAuth();

	const [isEditing, setIsEditing] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const [scrollDistance, setScrollDistance] = useState(0);

	const wrapperRef = useRef(null);
	const textRef = useRef(null);
	const inputRef = useRef(null);

	// Auto-focuses the text field when moving into active editing state
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	// Measures real span dimensions cleanly across screen updates
	useEffect(() => {
		if (isEditing) return;

		const checkOverflow = () => {
			if (!textRef.current || !wrapperRef.current) return;

			const containerWidth = wrapperRef.current.clientWidth;
			const textWidth = textRef.current.offsetWidth;

			if (textWidth > containerWidth) {
				setIsOverflowing(true);
				setScrollDistance(textWidth - containerWidth + 16);
			} else {
				setIsOverflowing(false);
				setScrollDistance(0);
			}
		};

		checkOverflow();

		const resizeObserver = new ResizeObserver(checkOverflow);
		if (wrapperRef.current) {
			resizeObserver.observe(wrapperRef.current);
		}

		return () => resizeObserver.disconnect();
	}, [title, device, isEditing]);

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			setIsEditing(false);
		}
	};

	const handleCategoryChange = (id) => {
		const selectedCategory = categoriesList.find(cat => cat.id === id);
		onCategoryChange?.(selectedCategory);
	};

	const isMobile = device === 'mobile';

	return (
		<header className={`${styles.navbar} ${styles[theme]}`}>
			<div className={styles.navContainer}>

				<div className={styles.leftSection}>
					{isMobile && setShowSide && (
						<button
							type="button"
							className={styles.menuButton}
							onClick={() => setShowSide(x => !x)}
							aria-label="Toggle custom sidebar"
						>
							☰
						</button>
					)}
					<Link to={`/notes/${id}`} className={styles.backLink} title="Back to dashboard">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
					</Link>
					{!isMobile && <span className={styles.logo}>CoNotate</span>}
				</div>

				<div className={styles.titleContainer}>
					<div ref={wrapperRef} className={styles.marqueeWrapper}>
						{isEditing ? (
							<input
								ref={inputRef}
								type="text"
								id="note-title-input"
								placeholder="Untitled Note"
								value={title}
								onChange={(e) => setTitle?.(e.target.value)}
								onBlur={() => setIsEditing(false)}
								onKeyDown={handleKeyDown}
								className={styles.titleInput}
							/>
						) : (
							<span
								ref={textRef}
								onClick={() => setIsEditing(true)}
								className={`${styles.titleText} ${isOverflowing ? styles.canAnimate : ''}`}
								style={{ '--scroll-dist': `-${scrollDistance}px` }}
							>
								{title || 'Untitled Note'}
							</span>
						)}
					</div>

					<div className={styles.categoryWrapper}>
						<select
							className={styles.categorySelect}
							value={categoryId}
							onChange={(e) => handleCategoryChange?.(e.target.value)}
							aria-label="Change category"
						>
							<option value="" disabled hidden>Category</option>
							{categoriesList.map(cat => (
								<option key={cat.id} value={cat.id}>{cat.name}</option>
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
					<span className={`${styles.statusIndicator} ${saveStatus.toLowerCase() !== 'saved' ? styles.saving : styles.saved}`}>
						{saveStatus}
					</span>

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

					{!isMobile && (
						<>
							{user ? (
								<button type="button" className={styles.avatarButton} aria-label="User profile">
									<span className={styles.avatarTxt}>
										{user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
									</span>
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
