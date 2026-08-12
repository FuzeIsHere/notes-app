import { auth } from "../config/firebase";
import { getNote } from "./notes.service";

const API_URL = import.meta.env.VITE_SEARCH_API_URL;

export const semanticSearch = async ({query, category, scope}) => {

    if(!query || !category || !scope) return [];

    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            query,
            category,
            scope
        })
    });

    if (!response.ok) {
        throw new Error("Search request failed");
    }

    const { noteIds } = await response.json();
    
    const notes = await Promise.all(noteIds.map( id => getNote(id) ))

    return notes
};