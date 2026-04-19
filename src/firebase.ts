// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwmtfoFVkfOELOmD2x5spLltidu3EnfKk",
  authDomain: "realtore-test.firebaseapp.com",
  projectId: "realtore-test",
  storageBucket: "realtore-test.firebasestorage.app",
  messagingSenderId: "125504009406",
  appId: "1:125504009406:web:1386fde3f5e4a9b09ddaef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);