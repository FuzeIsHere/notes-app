import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    getNotes,
    getNote,
    createNote,
    updateNote,
    updateTitle,
    updateCategory,
    togglePin,
    toggleArchive,
    toggleTrash,
    deleteNote,
} from '../services/notes.service';
import { createCategory, getCategories } from '../services/category.service';

const useNotesStore = create(persist((set, get) => ({
    // --- STATE VARIABLES ---
    notes: [],
    loading: true,
    updating: false,
    error: null,

    // --- STATE ACTIONS ---
    actions: {
        updateLocalNote: (id, changes) => {
            set({ updating: true });
            set(state => ({
                notes: state.notes.map(note =>
                    note.id === id ? { ...note, ...changes } : note
                )
            }));
            set({ updating: false });
        },

        refresh: async () => {
            set({ loading: true, error: null });
            try {
                const notes = await getNotes();
                set({ notes });
            } catch (error) {
                set({ error: error.message });
            } finally {
                set({ loading: false });
            }
        },

        addNote: async (preState = {}) => {
            const { id, data } = await createNote(preState);
            set((state) => ({
                notes: [...state.notes, { id, ...data }]
            }));
            return id;
        },

        read: async (id) => {
            const existingNote = get().notes.find(e => e.id === id);
            if (existingNote) return existingNote;

            try {
                const responseData = await getNote(id);
                if (!responseData) return null;

                const freshNote = { id, ...responseData };

                set(state => ({
                    notes: [...state.notes, freshNote]
                }));

                return freshNote;
            } catch (err) {
                return null;
            }
        },


        changeInNote: async (id, changes) => {
            await updateNote(id, changes);
            get().actions.updateLocalNote(id, changes); // Note the get().actions prefix
        },

        setTitle: async (id, title) => {
            await updateTitle(id, title);
            get().actions.updateLocalNote(id, { title });
        },

        setCategory: async (id, newCategory) => {
            await updateCategory(id, newCategory);
            const { name: categoryName, id: categoryId } = newCategory;
            get().actions.updateLocalNote(id, { categoryName, categoryId });
        },

        pin: async (id) => {
            await togglePin(id, false);
            get().actions.updateLocalNote(id, { pinned: true });
        },

        unpin: async (id) => {
            await togglePin(id, true);
            get().actions.updateLocalNote(id, { pinned: false });
        },

        archive: async (id) => {
            await toggleArchive(id, false);
            get().actions.updateLocalNote(id, { archived: true });
        },

        unarchive: async (id) => {
            const note = await get().actions.read(id)
            const categoryList = await getCategories();
            const category = categoryList.find(x => x.id === note.categoryId)
            //Unarchiving always should restore category if it doesn't already exists
            if (!category) {
                const newCategory = await createCategory(note.categoryName, note.categoryId)
                await get().actions.setCategory(id, newCategory)
            }

            await toggleArchive(id, true);
            get().actions.updateLocalNote(id, { archived: false });
        },

        moveToTrash: async (id) => {
            await toggleTrash(id, false);
            get().actions.updateLocalNote(id, { deleted: true });
        },

        restoreFromTrash: async (id) => {
            const note = await get().actions.read(id)
            const categoryList = await getCategories();
            const category = categoryList.find(x => x.id === note.categoryId)
            //The conditions means it should show in it's category upon restoration
            if (!category && !note.archived) {
                //hence restore the category for view
                const newCategory = await createCategory(note.categoryName, note.categoryId)
                await get().actions.setCategory(id, newCategory)
            }

            await toggleTrash(id, true);
            get().actions.updateLocalNote(id, { deleted: false });
        },

        permanentlyDelete: async (id) => {
            await deleteNote(id);
            set(state => ({
                notes: state.notes.filter(e => e.id !== id)
            }));
        }
    }
}), {
    name: 'notes-storage',
    partialize: (state) => {
        const { actions, ...rest } = state;
        return rest;
    },
}));

export default useNotesStore;