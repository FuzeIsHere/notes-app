import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { useAuth } from '../../../hooks/useAuth';
import { useUI } from '../../../hooks/useUI';
import { useNavigate } from 'react-router-dom';
import {
    getCategories,
    createCategory,
    updateCategoryName,
    deleteCategory
} from '../../../services/category.service';
import { getCategoryNotes } from '../../../services/notes.service';
import useNotesStore from '../../../store/useNotesStore';

export const Sidebar = ({
    isOpen,
    onClose,
    active,
    setActive
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { setCategory, moveToTrash } = useNotesStore(x => x.actions)

    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { device, theme, setTheme } = useUI();
    const isNotMobile = device !== 'mobile';

    const sidebarClasses = [
        styles.sidebar,
        styles[theme],
        isNotMobile ? styles.desktop : '',
        (!isNotMobile && isOpen) ? styles.mobileOpen : ''
    ].join(' ');

    // Fetch categories from database
    const fetchCategories = async () => {
        try {
            let data = await getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error("Failed to load categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const setActiveWrapper = (view) => {
        if (!isNotMobile) onClose();
        setActive(view);
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim() || isLoading) return;

        try {
            setIsLoading(true);
            await createCategory(newCategoryName.trim());
            setNewCategoryName('');
            await fetchCategories();
        } catch (error) {
            console.error("Failed to create category:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Start Rename Mode
    const startRename = (category) => {
        setEditingCategoryId(category.id);
        setEditingName(category.name);
    };

    const handleRenameCategory = async (category) => {
        if (!editingName.trim() || editingName.trim() === category.name || isLoading) {
            setEditingCategoryId(null);
            return;
        }

        try {
            setIsLoading(true);
            const notesToUpdateCatName = await getCategoryNotes(category.id)
            try {
                await Promise.all(notesToUpdateCatName.map(x => setCategory(x.id, {...category, name: editingName})))
            } catch (err) {
                throw new Error('Failed to rename category')
            }
            await updateCategoryName(category, editingName.trim());
            setEditingCategoryId(null);
            await fetchCategories();
        } catch (error) {
            console.error("Failed to update category name:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async (category, e) => {
        e.stopPropagation(); // Stop parent click event
        if (!window.confirm(`Are you sure you want to delete "${category.name}"?`)) return;

        try {
            setIsLoading(true);
            const notesToDelete = await getCategoryNotes(category.id)
            try {
                await Promise.all(notesToDelete.filter(x => !x.archived && !x.deleted).map(x => moveToTrash(x.id)))
            } catch (err) {
                throw new Error('Failed to delete category')
            }
            await deleteCategory(category);

            // If the deleted category was active, fallback to 'all' system view
            if (active.id === category.id && active.type === 'category') {
                setActive({ id: 'all', type: 'system' });
            }

            await fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        <strong>{user.displayName || 'User'}</strong>
                    </div>
                )}

                {/* Navigation Items */}
                <div className={styles.nav}>
                    <button
                        className={[styles.btn, active.id === 'all' && active.type === 'system' ? styles.active : ''].join(' ')}
                        onClick={() => setActiveWrapper({ id: 'all', type: 'system' })}
                    >
                        📝 All Notes
                    </button>

                    {/* Categories Sub-list */}
                    <div className={styles.categorySection}>
                        <span className={styles.label}>CATEGORIES</span>

                        {/* Category Input Form */}
                        <form onSubmit={handleCreateCategory} className={styles.addCategoryForm}>
                            <input
                                type="text"
                                placeholder="+ New category..."
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                disabled={isLoading}
                                className={styles.categoryInput}
                            />
                        </form>

                        <div className={styles.subContainer}>
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={[
                                        styles.categoryRow,
                                        active.id === category.id && active.type === 'category' ? styles.activeRow : ''
                                    ].join(' ')}
                                >
                                    {editingCategoryId === category.id ? (
                                        /* isolated wrapper for the editing state input */
                                        <div className={styles.editRowWrapper}>
                                            <input
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onBlur={() => handleRenameCategory(category)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleRenameCategory(category)}
                                                autoFocus
                                                disabled={isLoading}
                                                className={styles.renameInput}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                className={[styles.subBtn, active.id === category.id && active.type === 'category' ? styles.active : ''].join(' ')}
                                                onClick={() => setActiveWrapper({ id: category.id, type: 'category' })}
                                            >
                                                {category.name}
                                            </button>
                                            {
                                                category.id !== 'x' &&
                                                <div className={styles.actionRowBtns}>
                                                    <button
                                                        title="Rename"
                                                        onClick={() => startRename(category)}
                                                        className={styles.actionBtn}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        title="Delete"
                                                        onClick={(e) => handleDeleteCategory(category, e)}
                                                        className={[styles.actionBtn, styles.deleteBtnText].join(' ')}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            }
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>

                    <button
                        className={[styles.btn, active.id === 'archive' && active.type === 'system' ? styles.active : ''].join(' ')}
                        onClick={() => setActiveWrapper({ id: 'archive', type: 'system' })}
                    >
                        📥 Archive
                    </button>

                    <button
                        className={[styles.btn, active.id === 'trash' && active.type === 'system' ? styles.active : ''].join(' ')}
                        onClick={() => setActiveWrapper({ id: 'trash', type: 'system' })}
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
}