import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";



const firebaseConfig = {

    apiKey: "ISI_API_KEY_KAMU",

    authDomain: "ISI_AUTH_DOMAIN_KAMU",

    projectId: "ISI_PROJECT_ID_KAMU",

    storageBucket: "ISI_STORAGE_BUCKET_KAMU",

    messagingSenderId:
        "ISI_MESSAGING_SENDER_ID_KAMU",

    appId: "ISI_APP_ID_KAMU"

};



const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


export {
    app,
    auth,
    db
};
