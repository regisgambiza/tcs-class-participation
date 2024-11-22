// Import necessary React and Firebase modules
import React from "react"; // Import React library for component creation
import { auth, googleProvider } from "../firebase"; // Import initialized `auth` and `googleProvider` from firebase.js
import { signInWithPopup } from "firebase/auth"; // Function to handle pop-up-based Google login

const GoogleLogin = () => {
    // Function to handle the Google Sign-In process
    const handleGoogleLogin = async () => {
        try {
            // Trigger Google Sign-In using a pop-up
            const result = await signInWithPopup(auth, googleProvider);

            // `result.user` contains authenticated user's details
            const user = result.user;

            // Log user information to the console for debugging
            console.log("User Info:", user);

            // Display a welcome message with the user's display name
            alert(`Welcome, ${user.displayName}`);
        } catch (error) {
            // Log any errors that occur during login to the console
            console.error("Error during Google login:", error);
        }
    };

    // Render a button to trigger Google Login
    return (
        <div>
            {/* On button click, call the `handleGoogleLogin` function */}
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default GoogleLogin; // Export the component for use in other parts of the app
