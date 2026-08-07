import { create } from 'zustand';

import {
    getNotes,
    createNote,
    getNote,

    updateNote,

    updateTitle,
    updateCategory,

    togglePin,
    toggleArchive,
    toggleTrash,

    deleteNote,

} from '../services/notes.service';

const useNotesStore = create((set, get) => ({
    notes: [],
    loading: false,
    error: null,

    updateLocalNote: (id, changes) => {
        set(state => ({
            notes: state.notes.map(note =>
                note.id === id
                    ? { ...note, ...changes }
                    : note
            )
        }));
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
        const { id, data } = await createNote(preState)
        set((state) => ({
            notes: [...state.notes, { id, ...data() }]
        }))
    },
    read: (id) => {
        return get().notes.find(e => e.id === id)
    },
    changeInNote: async (id, changes) => {
        await updateNote(id, changes)
        get().updateLocalNote(id, changes)
    },
    setTitle: async (id, title) => {
        await updateTitle(id, title)
        get().updateLocalNote(id, { title })
    },

    setCategory: async (id, category) => {
        await updateCategory(id, category)
        get().updateLocalNote(id, { category })
    },

    pin: async (id) => {
        await togglePin(id, false)
        get().updateLocalNote(id, { pinned: true })
    },

    unpin: async (id) => {
        await togglePin(id, true)
        get().updateLocalNote(id, { pinned: false })
    },

    archive: async (id) => {
        await toggleArchive(id, false)
        get().updateLocalNote(id, { archived: true })
    },

    unarchive: async (id) => {
        await toggleArchive(id, true)
        get().updateLocalNote(id, { archived: false })
    },

    moveToTrash: async (id) => {
        await toggleTrash(id, false)
        get().updateLocalNote(id, { deleted: true })
    },

    restoreFromTrash: async (id) => {
        await toggleTrash(id, true)
        get().updateLocalNote(id, { deleted: false })
    },

    permanentlyDelete: async (id) => {
        await deleteNote(id)
        set(state => ({
            notes: state.notes.filter(e => e.id !== id)
        }))
    }

}));

export default useNotesStore;

/*
note = {
    ownerId: "...",

    collaborators: [],

    title: "Shopping",

    content: { },

    preview: '',

    category: "Personal",

    pinned: false,

    archived: false,

    deleted: false,

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp()
}
*/