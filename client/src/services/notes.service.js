import {
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    collection,
    serverTimestamp
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

const x = collection(db, 'notes')

export async function createNote(note) {
    const data = {
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
        preview: '',
        categoryName: "General",
        categoryId: "x",
        pinned: false,
        archived: false,
        deleted: false,
        created: serverTimestamp(),
        updated: serverTimestamp(),
        textLastUpdated: serverTimestamp(),
        ...note
    };
    const { id } = await addDoc(x, data)
    return { id, data };
}

export async function getNotes() {
    const q = query(x, where('ownerId', "==", auth.currentUser.uid))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCategoryNotes(categoryId) {
    const q = query(x, where('ownerId', "==", auth.currentUser.uid), where('categoryId', "==", categoryId))
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getNote(id) {
    try {
        const noteDocRef = doc(db, 'notes', id)
        const docSnap = await getDoc(noteDocRef)

        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
        else throw 'no such note exists'
    } catch (error) {
        throw error;
    }
}

export async function updateNote(id, updates) {

    delete updates.ownerId;
    delete updates.noteId;
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        ...updates,
        ...(('content' in updates) && { textLastUpdated: serverTimestamp() }),
        updated: serverTimestamp(),
    })
}

export async function updateTitle(id, title) {
    if (!title) return;
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        title,
        textLastUpdated: serverTimestamp()
    })
    return title
}

export async function updateCategory(id, newCategory) {

    const { name: categoryName, id: categoryId } = newCategory;

    //notes
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        categoryName,
        categoryId
    })

    //noteEmbeddings
    const noteEmbeddingDocRef = doc(db, 'noteEmbeddings', id)
    await updateDoc(noteEmbeddingDocRef, {
        categoryId
    })

    return newCategory
}

export async function togglePin(id, curr) {

    //notes
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        pinned: !curr
    })

    return !curr
}


export async function toggleArchive(id, curr) {

    //notes
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        archived: !curr
    })

    //noteEmbeddings
    const noteEmbeddingDocRef = doc(db, 'noteEmbeddings', id);
    await updateDoc(noteEmbeddingDocRef, {
        archived: !curr
    })

    return !curr
}

export async function toggleTrash(id, curr) {

    //notes
    const noteDocRef = doc(db, 'notes', id);
    await updateDoc(noteDocRef, {
        deleted: !curr
    })

    //noteEmbeddings
    const noteEmbeddingDocRef = doc(db, 'noteEmbeddings', id);
    await updateDoc(noteEmbeddingDocRef, {
        deleted: !curr
    })

    return !curr
}

export async function deleteNote(id) {

    //noteEmbeddings
    const noteEmbeddingDocRef = doc(db, 'noteEmbeddings', id);
    await deleteDoc(noteEmbeddingDocRef)

    //notes
    const noteDocRef = doc(db, 'notes', id);
    await deleteDoc(noteDocRef)
}
