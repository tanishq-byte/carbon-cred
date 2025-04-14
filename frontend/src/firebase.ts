// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

const firebaseConfig = {
    apiKey: "AIzaSyAtLZrIryqGzupgpCx0kNnVsFNwSBrS9DI",
    authDomain: "carbon-cred.firebaseapp.com",
    projectId: "carbon-cred",
    storageBucket: "carbon-cred.firebasestorage.app",
    messagingSenderId: "338409967410",
    appId: "1:338409967410:web:481e2ee093c1548087512b",
    //measurementId: "G-T0CWTW987J"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Add this
