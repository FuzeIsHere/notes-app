import React from 'react';
import styles from './NoteCard.module.css';
import { useUI } from '../../hooks/useUI';
export const NoteCard = ({
	title,
	preview,
	category,
	updatedAt,
	pinned = false,
	onPinClick,
	onOptionsClick
}) => {
	const { theme } = useUI();
	const isDark = theme === 'dark';
	const cardClassName = `${styles.card} ${isDark ? styles.dark : styles.light}`;
	const pinClassName = `${styles.actionButton} ${pinned ? styles.pinActive : ''}`;

	return (
		<div className={cardClassName}>
			{/* Top Header Row */}
			<div className={styles.headerRow}>
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
					onClick={onOptionsClick}
					aria-label="More options"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<circle cx="12" cy="12" r="1"></circle>
						<circle cx="12" cy="5" r="1"></circle>
						<circle cx="12" cy="19" r="1"></circle>
					</svg>
				</button>
			</div>

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
				<span className={styles.timestamp}>{updatedAt}</span>
			</div>
		</div>
	);
};
