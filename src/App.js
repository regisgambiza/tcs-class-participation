// Importing necessary libraries and components
import React, { useState, useEffect } from 'react'; // React library for building UI and React hooks
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // React Router components for navigation
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Firebase authentication methods
import { auth, firestore } from './firebase'; // Importing Firebase auth and Firestore configuration
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Firestore methods to interact with the database
import ClassSelection from './components/ClassSelection'; // Component for selecting class
import Profile from './components/Profile'; // Component for user profile
import './components/styles/App.css'; // CSS file for styling the app
import Shop from './components/Shop'; // Component for the shop functionality
import { Link } from 'react-router-dom';
import Purchases from "./components/Purchases"; // Link component for navigation
import './components/styles/SignInPage.css';
import SignInPage from "./components/SignInPage";


// Main App component
function App() {
    // State hooks to manage application state
    const [user, setUser] = useState(null); // State to store the currently logged-in user
    const [isClassSelected, setIsClassSelected] = useState(false); // Tracks if the user has selected a class
    const [selectedClass, setSelectedClass] = useState(''); // Stores the selected class name
    const [balance, setBalance] = useState(0); // Stores the user's balance

    // Effect hook to fetch user data from Firestore after login
    useEffect(() => {
        if (user) { // If a user is logged in
            console.log(user);
            const fetchUserData = async () => {
                const userDocRef = doc(firestore, 'users', user.uid); // Reference to the user's document in Firestore
                const userDocSnap = await getDoc(userDocRef); // Retrieve the document snapshot

                if (userDocSnap.exists()) { // Check if the document exists
                    const userData = userDocSnap.data(); // Retrieve data from the document
                    if (userData.class) { // If the user has a class assigned
                        setSelectedClass(userData.class); // Update selected class state
                        setIsClassSelected(true); // Indicate that a class is selected
                    } else {
                        setIsClassSelected(false); // No class assigned
                    }

                    // Update balance state if it exists in Firestore, default to 0 if not
                    setBalance(userData.balance || 0);
                } else {
                    setIsClassSelected(false); // No user document exists
                }
            };

            fetchUserData(); // Call the function to fetch user data
        }
    }, [user]); // Dependency array ensures this effect runs when 'user' changes

    // Function to handle Google sign-in
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider(); // Create a new Google auth provider instance
            const result = await signInWithPopup(auth, provider); // Show Google sign-in popup
            const loggedInUser = result.user; // Get user info from the result

            setUser(loggedInUser); // Update user state with logged-in user details

            const userDocRef = doc(firestore, 'users', loggedInUser.uid); // Reference to user's Firestore document
            const userDocSnap = await getDoc(userDocRef); // Fetch user document

            console.log("Login user", loggedInUser.uid); // Log the user ID
            const my_user_id = loggedInUser.uid; // Store user ID in a local variable
            console.log("My user id", my_user_id);

            if (!userDocSnap.exists()) { // If user document does not exist
                await setDoc(userDocRef, {
                    displayName: loggedInUser.displayName, // Store user's display name
                    email: loggedInUser.email, // Store user's email
                    class: '', // Default to no class selected
                    balance: 0, // Default balance
                }); // Create a new user document in Firestore
            }
        } catch (error) {
            console.error("Error during Google login:", error); // Log any errors during login
        }
    };

    return (
        <Router> {/* Router component to handle navigation */}
            <div className="app-container"> {/* Main container for the app */}
                {user && isClassSelected && ( // Render navbar if user is logged in and has selected a class
                    <nav className="navbar"> {/* Navigation bar */}
                        <ul>
                            <li>
                                <Link to="/profile">Home</Link> {/* Link to profile page */}
                            </li>
                            <li>
                                <Link to="/shop">Shop</Link> {/* Link to shop page */}
                            </li>
                            <li>
                                <Link to="/purchases">Purchases</Link> {/* Link to shop page */}
                            </li>
                        </ul>
                    </nav>
                )}
                <div className="app-body"> {/* Main content area */}
                    <Routes> {/* Define routes for the application */}
                        <Route
                            path="/"
                            element={
                                !user ? (
                                    <SignInPage signInWithGoogle={signInWithGoogle} />
                                ) : isClassSelected ? (
                                    <Navigate to="/profile" />
                                ) : (
                                    <ClassSelection
                                        user={user}
                                        onClassSelected={(className) => {
                                            setSelectedClass(className);
                                            setIsClassSelected(true);
                                        }}
                                    />
                                )
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                user && isClassSelected ? ( // If user is logged in and class is selected
                                    <Profile user={user} selectedClass={selectedClass} balance={balance} />
                                ) : (
                                    <Navigate to="/" /> // Redirect to home if not
                                )
                            }
                        />
                        <Route
                            path="/shop"
                            element={
                                user && isClassSelected ? ( // If user is logged in and class is selected
                                    <Shop user={user}/>
                                ) : (
                                    <Navigate to="/" /> // Redirect to home if not
                                )
                            }
                        />
                        <Route
                            path="/purchases"
                            element={user ? <Purchases userId={user.uid} /> : <Navigate to="/login" />}
                        />

                    </Routes>
                </div>
                {/* Footer section */}
                <footer className="app-footer">
                    © 2025, Powered by Regis Hello Kitty
                </footer>
            </div>
        </Router>
    );
}

// Export the App component for use in other files
export default App;
