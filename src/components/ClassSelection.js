import React, { useState } from 'react'; // Import React and useState for managing state
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore functions for document creation
import { firestore } from '../firebase'; // Import Firestore instance from the firebase configuration

// Define the ClassSelection component
const ClassSelection = ({ user, onClassSelected }) => {
    // State to track the selected class
    const [className, setClassName] = useState('');

    /**
     * Handle the class selection submission
     * - Validates that a class is selected
     * - Saves the class information to Firestore
     */
    const handleClassSelection = async () => {
        // Ensure a class is selected before proceeding
        if (className) {
            try {
                // Save user details and class info to Firestore under the user's UID
                await setDoc(doc(firestore, 'users', user.uid), {
                    displayName: user.displayName, // User's name
                    email: user.email, // User's email
                    class: className, // Selected class
                    balance:0,
                });

                // Notify parent component that the class is selected
                onClassSelected(className);
            } catch (error) {
                console.error("Error saving class information:", error); // Log any errors during the Firestore operation
            }
        } else {
            // Alert the user if no class is selected
            alert("Please select a class.");
        }
    };

    // Render the class selection UI
    return (
        <div>
            {/* Welcome message for the user */}
            <h2>Welcome, {user.displayName}!</h2>
            <p>Please select your class:</p>

            {/* Dropdown menu for selecting a class */}
            <select value={className} onChange={(e) => setClassName(e.target.value)}>
                <option value="">Select Class</option>
                {/* Default empty option */}
                <option value="7/1">7/1</option>
                <option value="7/2">7/2</option>
                <option value="7/3">7/3</option>
                <option value="8/1">8/1</option>
                <option value="8/2">8/2</option>
            </select>

            {/* Button to submit the selected class */}
            <button onClick={handleClassSelection}>Submit</button>
        </div>
    );
};

export default ClassSelection; // Export the component for use in other parts of the app
