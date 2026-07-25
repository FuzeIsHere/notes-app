import React, { useState } from 'react';
import styles from './Navbar.module.css';
import { Button } from './Button';
import { Input } from './Input';
import { useUI } from '../../hooks/useUI';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({
	search = '',
	setSearch = null,
	setShowSide = null
}) => {

	const { device } = useUI();
	const { user } = useAuth();

	return (
		<header className={styles.navbar}>
			<div className={styles.navContainer}>

				{/* LEFT SECTION */}
				<div className={styles.leftSection}>
					{/* Mobile Side Menu Trigger Button */}
					{
						device === 'mobile' &&
						<button
							type="button"
							className={styles.menuButton}
							onClick={() => setShowSide(x => !x)}
							aria-label="Toggle custom sidebar"
						>
							☰
						</button>
					}

					<a href="/" className={styles.logo}>BrandLogo</a>
				</div>

				{/* CENTER SECTION (Search Bar - Always Visible) */}
				<div className={styles.searchContainer}>
					<Input
						id="global-search"
						placeholder="Search..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className={styles.searchInputOverride}
					/>
				</div>

				{/* RIGHT SECTION (User Icon / Log In - Desktop Only) */}
				<div className={styles.rightSection} style={{ display: device !== 'mobile' ? 'block' : 'none' }}>
					{!!user ? (
						<button type="button" className={styles.avatarButton} aria-label="User profile">
							<img
								className={styles.avatarImg}
								src="https://unsplash.com"
								alt=""
							/>
						</button>
					) : (
						<Button variant="primary" size="sm">Log In</Button>
					)}
				</div>

			</div>
		</header>
	);
};

export default Navbar;