import { doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const x = collection(db, 'notes')
//const ownerId = auth.currentUser.uid;

export async function createNote(note) {
    return await addDoc(x, {
        ownerId: auth.currentUser.uid,
        collaborators: [],

        title: "New",
        content: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph"
                }
            ]
        },
        category: "personal",

        pinned: false,
        archived: false,
        deleted: false,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        ...note
    })
}

export async function getNotes(userId) {
    const q = query(x, where('ownerId', "==", auth.currentUser.uid))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getNote(id) {
    try {
        const noteDocRef = doc(db, 'notes', id)
        const docSnap = await getDoc(noteDocRef)

        if (docSnap.exists()) return docSnap.data();
        else return null;
    } catch (error) {
        throw error;
    }

}

export async function updateNote(id, updates) {
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        ...updates,
        updated: serverTimestamp()
    })
}

export async function updateTitle(id, title) {
    if (!title) return;
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        title
    })
    return title
}

export async function updateCategory(id, category) {
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        category
    })
    return category
}

export async function togglePin(id, curr) {
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        pinned: !curr
    })
    return !curr
}


export async function toggleArchive(id, curr) { 
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        archived: !curr
    })
    return !curr
}

export async function toggleTrash(id, curr) {
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        deleted: !curr
    })
    return !curr
}

export async function deleteNote(id) {
    const noteDocRef = doc(db, 'notes', id);
    await deleteDoc(noteDocRef)
}
