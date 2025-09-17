// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1478oFY6I2W_bsUFLCDZ_5pX2eF-5eyk",
    authDomain: "defecttracker-41bba.firebaseapp.com",
    projectId: "defecttracker-41bba",
    storageBucket: "defecttracker-41bba.firebasestorage.app",
    messagingSenderId: "873508229902",
    appId: "1:873508229902:web:874f8162c970af4356bd5f",
    measurementId: "G-0C8RY3N0X6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
export { createUserWithEmailAndPassword };
