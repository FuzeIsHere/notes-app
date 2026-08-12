import { serverTimestamp } from "firebase/firestore";

note = {
    ownerId: "...",
    collaborators: [],
    title: "Shopping",
    content: { /*...TipTap JSON...*/ },
    preview: '',
    category: "Personal",
    pinned: false,
    archived: false,
    deleted: false,
    created: serverTimestamp(),
    updated: serverTimestamp(),
    textLastUpdated: serverTimestamp(),
}