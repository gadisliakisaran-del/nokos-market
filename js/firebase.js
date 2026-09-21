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

    apiKey: "AIzaSyAwudjyWbOqS0S0ofAJOgTMg-J4tLIfZYA",

    authDomain: "nokos-market.firebaseapp.com",

    projectId: "nokos-market",

    storageBucket: "nokos-market.firebasestorage.app",

    messagingSenderId:
        "361159469478",

    appId: "1:361159469478:web:c4de1f6915daa354130767"

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
