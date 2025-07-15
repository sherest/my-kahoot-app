// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB6opBVS5BvWvKHoAk1RnQxAftcOOGt8lk",
    authDomain: "kahoot-clone-hackathon.firebaseapp.com",
    projectId: "kahoot-clone-hackathon",
    storageBucket: "kahoot-clone-hackathon.firebasestorage.app",
    messagingSenderId: "189826905063",
    appId: "1:189826905063:web:e11691f1a6b8687fc60342",
    measurementId: "G-7FRWZG9NKB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore
export const db = getFirestore(app);