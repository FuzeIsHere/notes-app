import React, { useState, useEffect, useRef } from 'react';
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
	categoryId = '',
	onCategoryChange = null,
	categoriesList = [{ name: "General", id: "x" }],
	pinned = false,
	onTogglePin = null,
	onArchive,
	onDelete = null,
	menuOptions = []
}) => {

	const navigate = useNavigate();
	const { device, theme } = useUI();
	const { user } = useAuth();

	const [popupTarget, setPopupTarget] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const [scrollDistance, setScrollDistance] = useState(0);

	const wrapperRef = useRef(null);
	const textRef = useRef(null);
	const inputRef = useRef(null);

	const handleThreeDotsClick = (e) => {
		setPopupTarget(e.currentTarget.getBoundingClientRect());
	};

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

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

	// Extracted controls markup to render them adaptively based on device state
	const renderActionControls = () => (
		<>
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
				className={`${styles.actionIconButton} ${pinned ? styles.pinnedButton : ''}`}
				onClick={onTogglePin}
				title={pinned ? "Unpin note" : "Pin note"}
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="17" y2="22" /><path d="M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.12-2.6A2 2 0 0 1 16 10.16V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6.16a2 2 0 0 1-.44 1.24l-2.12 2.6a2 2 0 0 0-.44 1.24Z" /></svg>
			</button>
		</>
	);

	const renderTitleContainer = () => (
		<div className={`${styles.titleContainer} ${isMobile ? styles.titleMobileRow : ''}`}>
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

			{/* Only render next to title on Desktop layout */}
			{!isMobile && renderActionControls()}
		</div>
	);

	return (
		<header className={`${styles.navbar} ${styles[theme]}`}>
			<div className={`${styles.navContainer} ${isMobile ? styles.containerMobile : ''}`}>

				<div className={styles.leftSection}>
					<Link to="/dashboard" className={styles.backLink} title="Back to dashboard">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
					</Link>
					{!isMobile && <span className={styles.logo}>CoNotate</span>}
				</div>

				{!isMobile && renderTitleContainer()}

				<div className={styles.rightSection}>
					{/* Render controls at the top layout next to "More Options" on Mobile layout */}
					{isMobile && renderActionControls()}

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

					{!isMobile && (
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

				{isMobile && renderTitleContainer()}

			</div>
		</header>
	);
};

export default NoteNavbar;
