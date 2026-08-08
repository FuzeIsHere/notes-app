import { useEffect } from "react";
import useNotesStore from "../store/useNotesStore";

export const useMenu = (keys) => {

    const archive = useNotesStore(state => state.actions.archive);
    const unarchive = useNotesStore(state => state.actions.unarchive);
    const moveToTrash = useNotesStore(state => state.actions.moveToTrash);
    const restoreFromTrash = useNotesStore(state => state.actions.restoreFromTrash);
    const permanentlyDelete = useNotesStore(state => state.actions.permanentlyDelete);

    const menuOptions = {
        edit: id => ({ label: 'Edit', action: () => window.open(`/notes/${id}/edit`, '_blank', 'noopener,noreferrer') }),
        archive: id => ({ label: 'Archive', action: async () => { await archive(id); } }),
        unarchive: id => ({ label: 'Unarchive', action: async () => { await unarchive(id); } }),
        trash: id => ({ label: 'Delete', action: async () => { await moveToTrash(id); } }),
        restore: id => ({ label: 'Restore', action: async () => { await restoreFromTrash(id); } }),
        delete: id => ({ label: 'Permanently delete', action: async () => { await permanentlyDelete(id); } }),
    };
    return (id) => {
        let menu = []
        for (const key of keys) menu.push((menuOptions[key])(id))
        return menu
    }
}