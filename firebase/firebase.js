
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBx3sGQ2uRskSf0GD4JbmhPWwymw0w0oj4",
    authDomain: "chatapp-efca6.firebaseapp.com",
    projectId: "chatapp-efca6",
    storageBucket: "chatapp-efca6.appspot.com",
    messagingSenderId: "510921711517",
    appId: "1:510921711517:web:44443f0802774fed799974"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app);