import React from 'react';
import styles from './Navbar.module.css';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { useUI } from '../../../hooks/useUI';
import { useAuth } from '../../../hooks/useAuth';
import { Plus } from 'lucide-react'; // Added modern icon

const Navbar = ({
	search = '',
	setSearch = null,
	setShowSide = null,
	buttons = []
}) => {
	const { device, theme } = useUI();
	const { user } = useAuth();
	const isMobile = device === 'mobile';

	// Shared Search Component
	const SearchBar = (
		<div className={styles.searchContainer} style={{ maxWidth: isMobile ? 'none' : '500px' }}>
			<Input
				id="global-search"
				placeholder="Search..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className={styles.searchInputOverride}
			/>
		</div>
	);

	// Shared Buttons Component
	const ActionButtons = (
		<div className={styles.buttonsSection}>
			{buttons.map(({ name, event }) => {
				const isNoteBtn = name.toLowerCase().includes('note');
				return (
					<button
						key={name}
						onClick={event}
						className={isNoteBtn ? styles.noteButton : styles.defaultButton}
					>
						{/* Render icon if it's the Note button */}
						{isNoteBtn && <Plus size={16} strokeWidth={2.5} />}
						<span>{name}</span>
					</button>
				);
			})}
		</div>
	);

	return (
		<header className={`${styles.navbar} ${styles[theme]}`}>
			<div className={isMobile ? styles.navContainerMobile : styles.navContainerDesktop}>

				{isMobile ? (
					<>
						<div className={styles.topRowMobile}>
							<div className={styles.leftSection}>
								<button
									type="button"
									className={styles.menuButton}
									onClick={() => setShowSide(x => !x)}
									aria-label="Toggle custom sidebar"
								>
									☰
								</button>
								<a href="/" className={styles.logo}>CoNotate</a>
							</div>
							{ActionButtons}
						</div>
						{SearchBar}
					</>
				) : (
					<>
						<div className={styles.leftSection}>
							<a href="/" className={styles.logo}>CoNotate</a>
						</div>

						{SearchBar}

						<div className={styles.rightGroupDesktop}>
							{ActionButtons}
							<div className={styles.rightSection}>
								{user ? (
									<button type="button" className={styles.avatarButton} aria-label="User profile">
										<span className={styles.avatarTxt}>
											{user?.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
										</span>
									</button>
								) : (
									<Button variant="primary" size="sm">Log In</Button>
								)}
							</div>
						</div>
					</>
				)}

			</div>
		</header>
	);
};

export default Navbar;
