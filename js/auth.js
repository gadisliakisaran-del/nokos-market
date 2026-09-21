import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


import {
    auth,
    db
} from "./firebase.js";



export async function registerUser(
    name,
    email,
    password
) {

    const credential =
        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


    const user =
        credential.user;


    await updateProfile(
        user,
        {
            displayName: name
        }
    );


    await setDoc(
        doc(db, "users", user.uid),
        {

            name: name,

            email: email,

            balance: 0,

            role: "user",

            createdAt: serverTimestamp()

        }
    );


    return user;
}



export async function loginUser(
    email,
    password
) {

    const credential =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


    return credential.user;
      }
