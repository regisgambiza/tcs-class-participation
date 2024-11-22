// src/App.js

import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth'; // Firebase authentication
import { GoogleAuthProvider } from 'firebase/auth'; // Google Auth provider
import { setDoc, doc } from 'firebase/firestore'; // Firestore functions
import { auth, firestore } from './firebase'; // Import auth and firestore from firebase.js

function App() {
    const [user, setUser] = useState(null); // State to store user data
    const [className, setClassName] = useState(''); // State to store selected class
    const [isClassSelected, setIsClassSelected] = useState(false); // State to track if class is selected

    // Handle Google Sign-in
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider(); // Initialize Google Auth provider
            const result = await signInWithPopup(auth, provider); // Sign in with popup
            const user = result.user; // Get user info from result
            setUser(user); // Set user state
            setIsClassSelected(false); // Reset class selection state
        } catch (error) {
            console.error("Error during Google login:", error); // Log any errors
        }
    };

    // Handle class selection after login
    const handleClassSelection = async () => {
        if (className) { // Check if className is not empty
            try {
                // Save user data (including selected class) to Firestore
                await setDoc(doc(firestore, 'users', user.uid), {
                    displayName: user.displayName, // Store display name
                    email: user.email, // Store email
                    class: className, // Store class selected
                });

                setIsClassSelected(true); // Mark class as selected
            } catch (error) {
                console.error("Error saving class information:", error); // Log any errors
            }
        } else {
            alert("Please select a class."); // Alert if class is not selected
        }
    };

    return (
        <div>
            <h1>Class Participation App</h1>
            {/* Check if user is not logged in */}
            {!user ? (
                <button onClick={signInWithGoogle}>Sign In with Google</button> // Show Google Sign In button
            ) : !isClassSelected ? (
                // If user is logged in but has not selected a class
                <div>
                    <h2>Welcome, {user.displayName}!</h2>
                    <p>Please select your class:</p>
                    <select value={className} onChange={(e) => setClassName(e.target.value)}>
                        {/* Dropdown for class selection */}
                        <option value="">Select Class</option>
                        <option value="Class 7A">Class 7A</option>
                        <option value="Class 7B">Class 7B</option>
                        <option value="Class 8A">Class 8A</option>
                        <option value="Class 8B">Class 8B</option>
                    </select>
                    <button onClick={handleClassSelection}>Submit</button> {/* Submit button to save class */}
                </div>
            ) : (
                // After class selection is done
                <div>
                    <h2>Thank you for selecting your class!</h2>
                    <p>Your class: {className}</p>
                </div>
            )}
        </div>
    );
}

export default App;
