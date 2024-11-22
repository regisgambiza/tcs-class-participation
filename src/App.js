import React, { useState } from 'react'; // Import React and useState for state management
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import Firebase authentication functions
import { auth } from './firebase'; // Import Firebase auth instance
import ClassSelection from './components/ClassSelection'; // Import the ClassSelection component

// Main App component
function App() {
    const [user, setUser] = useState(null); // State to store the logged-in user
    const [isClassSelected, setIsClassSelected] = useState(false); // State to track if the user has selected a class
    const [selectedClass, setSelectedClass] = useState(''); // State to store the selected class

    /**
     * Handle user sign-in with Google
     * - Opens a Google sign-in popup
     * - Updates user state upon successful login
     */
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider(); // Create a Google Auth provider instance
            const result = await signInWithPopup(auth, provider); // Show the sign-in popup and get the result
            setUser(result.user); // Save the signed-in user to state
        } catch (error) {
            console.error("Error during Google login:", error); // Log any errors that occur during login
        }
    };

    return (
        <div>
            {/* App Title */}
            <h1>Class Participation App</h1>

            {/* Render content based on user's state */}
            {!user ? (
                // If the user is not logged in, show the Google Sign-In button
                <button onClick={signInWithGoogle}>Sign In with Google</button>
            ) : !isClassSelected ? (
                // If the user is logged in but hasn't selected a class, render the ClassSelection component
                <ClassSelection
                    user={user} // Pass the logged-in user to the component
                    onClassSelected={(className) => {
                        setIsClassSelected(true); // Mark class selection as completed
                        setSelectedClass(className); // Save the selected class
                    }}
                />
            ) : (
                // If the user has selected a class, show a thank-you message
                <div>
                    <h2>Thank you for selecting your class!</h2>
                    <p>Your class: {selectedClass}</p>
                </div>
            )}
        </div>
    );
}

export default App; // Export the App component for rendering
