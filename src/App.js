import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, firestore } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import ClassSelection from './components/ClassSelection';
import Profile from './components/Profile'; // Import the Profile component
import './components/styles/App.css';
import Shop from './components/Shop'; // Import Shop component
import { Link } from 'react-router-dom';


function App() {
    const [user, setUser] = useState(null); // State to store the logged-in user
    const [isClassSelected, setIsClassSelected] = useState(false); // State to track if the user has selected a class
    const [selectedClass, setSelectedClass] = useState(''); // State to store the selected class
    const [balance, setBalance] = useState(0); // State to store the user's balance

    // Effect to fetch user data from Firestore after login
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.class) {
                        setSelectedClass(userData.class);
                        setIsClassSelected(true);
                    } else {
                        setIsClassSelected(false);
                    }

                    // Set the balance from Firestore if it exists
                    setBalance(userData.balance || 0); // Default to 0 if balance is not found
                } else {
                    setIsClassSelected(false);
                }
            };

            fetchUserData();
        }
    }, [user]); // Re-run this effect when user state changes

    // Google Sign-In function
    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const loggedInUser = result.user;

            setUser(loggedInUser);

            // Check if user already has class info, if not, they will select a class
            const userDocRef = doc(firestore, 'users', loggedInUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // Set user data in Firestore if it's a new user
                await setDoc(userDocRef, {
                    displayName: loggedInUser.displayName,
                    email: loggedInUser.email,
                    class: '', // Initially no class selected
                    balance: 0, // Default balance
                });
            }
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    };

    return (
    <Router>
        <div className="app-container">
            {user && isClassSelected && (
                <nav className="navbar">
                    <ul>
                        <li>
                            <Link to="/profile">Home</Link>
                        </li>
                        <li>
                            <Link to="/shop">Shop</Link>
                        </li>
                    </ul>
                </nav>
            )}
    <div className="app-body">

                <h1 className="app-heading">Class Participation</h1>
                <Routes>
                    {/* Route for login */}
                    <Route
                        path="/"
                        element={
                            !user ? (
                                <button className="sign-in-button" onClick={signInWithGoogle}>
                                    Sign In with Google
                                </button>
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
                    {/* Route for Profile Page */}
                    <Route
                        path="/profile"
                        element={
                            user && isClassSelected ? (
                                <Profile user={user} selectedClass={selectedClass} balance={balance} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                    <Route
                        path="/shop"
                        element={
                            user && isClassSelected ? (
                                <Shop user={user} balance={balance} />
                            ) : (
                                <Navigate to="/" />
                            )
                        }
                    />
                </Routes>
            </div>
            {/* Footer */}
            <footer className="app-footer">
                © 2025, Powered by Regis Hello Kitty
            </footer>
        </div>
    </Router>
);

}

export default App;
