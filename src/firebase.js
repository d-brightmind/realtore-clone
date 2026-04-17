// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdKaAPWuTDoCcJyWXuoYQjjTiUbm1K3ws",
  authDomain: "realtore-clone-b1891.firebaseapp.com",
  projectId: "realtore-clone-b1891",
  storageBucket: "realtore-clone-b1891.firebasestorage.app",
  messagingSenderId: "1004050395758",
  appId: "1:1004050395758:web:bdd280f62de96558e16c7f",
  measurementId: "G-ZTYG7EW1GH"
};

// Initialize Firebase
initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore();