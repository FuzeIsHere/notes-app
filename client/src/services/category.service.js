import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayRemove,
    arrayUnion,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";


export async function getCategories() {
    try {
        const noteDocRef = doc(db, 'users', auth.currentUser.uid)
        const docSnap = await getDoc(noteDocRef)

        const docData = docSnap.data()

        if (docSnap.exists()) return docData.categories;
        else throw 'no such note exists'
    } catch (error) {
        throw error;
    }
}

export async function createCategory(name, id = null) {

    const userRef = doc(db, "users", auth.currentUser.uid);

    const newCategory = {
        id: id ? id : crypto.randomUUID(),
        name: name,
        created: Timestamp.now()
    };

    await updateDoc(userRef, {
        categories: arrayUnion(newCategory)
    });

    return newCategory;
}

export const updateCategoryName = async (oldCategory, newName) => {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const updatedCategory = {
        ...oldCategory,
        name: newName
    };

    await updateDoc(userRef, {
        categories: arrayRemove(oldCategory)
    });

    await updateDoc(userRef, {
        categories: arrayUnion(updatedCategory)
    });
};

export const deleteCategory = async (category) => {
    const userRef = doc(db, "users", auth.currentUser.uid);

    await updateDoc(userRef, {
        categories: arrayRemove(category)
    });
};



// export const init = async () => {
//     await setDoc(doc(db, "users", auth.currentUser.uid), {
//         email: auth.currentUser.email,
//         displayName: 'Fuze',
//         categories: [{
//             name: "General",
//             id: "x",
//             created: Timestamp.now()
//         }],
//     });
// }