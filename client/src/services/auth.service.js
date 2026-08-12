import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import {
    doc, setDoc,
    collection, Timestamp
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

export const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
        displayName: displayName,
    });

    await setDoc(doc(db, "users", user.uid), {
        email: email,
        displayName: displayName,
        categories: [{
            name: "General",
            id: "x",
            created: Timestamp.now()
        }],
    });
};

export const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
    return await signOut(auth);
};