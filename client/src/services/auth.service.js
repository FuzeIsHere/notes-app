import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

import { auth } from "../config/firebase";

export const signup = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });
};

export const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
    return await signOut(auth);
};