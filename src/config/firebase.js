import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC072QgjhZEVoPD30fMpLV377BkQNWvIOY",
    authDomain: "planify-14f88.firebaseapp.com",
    projectId: "planify-14f88",
    storageBucket: "planify-14f88.firebasestorage.app",
    messagingSenderId: "927909774999",
    appId: "1:927909774999:web:e6c78121c6784337fb0bd2",
    measurementId: "G-04M6PEYNTR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider()
