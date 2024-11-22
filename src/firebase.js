// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCc8o4FDgFwiVcvauEHG1KRlCHcKl7glGY", // Your API key
    authDomain: "tcs-class-participation.firebaseapp.com", // Firebase auth domain
    projectId: "tcs-class-participation", // Firebase project ID
    storageBucket: "tcs-class-participation.appspot.com", // Firebase storage URL
    messagingSenderId: "116252288931", // Sender ID
    appId: "1:116252288931:web:d9dab9ca1c422dd2d5dc16", // App ID
    measurementId: "G-VY4VZGN3ZH" // Optional: Google Analytics measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const firestore = getFirestore(app); // Initialize Firestore

// Export auth and firestore for use in other parts of the app
export { auth, firestore, GoogleAuthProvider }; // Make sure firestore is exported
