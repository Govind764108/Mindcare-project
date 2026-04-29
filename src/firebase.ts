import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBU0FkrTSNiql7Zwox4bdVPiTphDIHdKn0",
  authDomain: "mentalhealthapp-29854.firebaseapp.com",
  projectId: "mentalhealthapp-29854",
  storageBucket: "mentalhealthapp-29854.firebasestorage.app",
  messagingSenderId: "359229595451",
  appId: "1:359229595451:web:19529a15fe235bbb87a11e",
  measurementId: "G-2LYG45QVC6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
