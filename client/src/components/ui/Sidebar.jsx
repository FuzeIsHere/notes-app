import React, { useState } from 'react';
import styles from './Sidebar.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({
    isOpen,
    onClose,
    userEmail = "user@example.com"
}) => {
    const [active, setActive] = useState('all-notes');
    //const [isDark, setIsDark] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const categories = ['Work', 'Personal', 'Ideas'];

    const { device, theme, setTheme } = useUI();
    const isNotMobile = device !== 'mobile';
    // Combine classes dynamically for open/close states
    const sidebarClasses = [
        styles.sidebar,
        isNotMobile ? styles.desktop : '',
        (!isNotMobile && isOpen) ? styles.mobileOpen : ''
    ].join(' ');

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <>
            {/* Mobile Background Overlay */}
            {!isNotMobile && isOpen && <div className={styles.overlay} onClick={onClose} />}

            <aside className={sidebarClasses}>
                {/* Mobile Header */}
                {!isNotMobile && (
                    <div className={styles.mobileHeader}>
                        <strong>Menu</strong>
                        <button onClick={onClose} className={styles.closeBtn}>✕</button>
                    </div>
                )}

                {/* Conditional Identity (Only on Mobile/Tablet when Logged In) */}
                {!isNotMobile && user && (
                    <div className={styles.userBanner}>
                        <span>Logged in as:</span>
                        <strong>{userEmail}</strong>
                    </div>
                )}

                {/* Navigation Items */}
                <div className={styles.nav}>
                    <button
                        className={[styles.btn, active === 'all-notes' ? styles.active : ''].join(' ')}
                        onClick={() => setActive('all-notes')}
                    >
                        📝 All Notes
                    </button>

                    <button
                        className={[styles.btn, active === 'fav' ? styles.active : ''].join(' ')}
                        onClick={() => setActive('fav')}
                    >
                        ⭐ Favourites
                    </button>

                    {/* Categories Sub-list */}
                    <div className={styles.categorySection}>
                        <span className={styles.label}>CATEGORIES</span>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={[styles.subBtn, active === cat ? styles.active : ''].join(' ')}
                                onClick={() => setActive(cat)}
                            >
                                • {cat}
                            </button>
                        ))}
                    </div>

                    <button
                        className={[styles.btn, active === 'archive' ? styles.active : ''].join(' ')}
                        onClick={() => setActive('archive')}
                    >
                        📥 Archive
                    </button>

                    <button
                        className={[styles.btn, active === 'trash' ? styles.active : ''].join(' ')}
                        onClick={() => setActive('trash')}
                    >
                        🗑️ Trash
                    </button>
                </div>

                {/* Footer Controls */}
                <div className={styles.footer}>
                    <button className={styles.btn} onClick={() => setTheme(x => x === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>

                    <hr className={styles.divider} />

                    {user ? (
                        <button className={[styles.btn, styles.logout].join(' ')} onClick={handleLogout}>🚪 Log Out</button>
                    ) : (
                        <button className={[styles.btn, styles.login].join(' ')}>🔐 Log In</button>
                    )}
                </div>
            </aside>
        </>
    );
};
