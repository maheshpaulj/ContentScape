// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC508E3GRmIbTBUxRYiq0bC5fNmb15pPEI",
  authDomain: "contentscape-auth.firebaseapp.com",
  projectId: "contentscape-auth",
  storageBucket: "contentscape-auth.firebasestorage.app",
  messagingSenderId: "813422261843",
  appId: "1:813422261843:web:8ed02a03f7ece47704b8a6",
  measurementId: "G-HRX0PE25N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);