import React from 'react';
import './styles/Shop.css'; // Add styling for the shop
import { useState, useEffect } from "react";
import updateUserBalance from "../utilities/updateUserBalance";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import fetchUserBalance from "../utilities/fetchUserBalance"; // Adjust path as necessary
import { authenticateWithBiometrics } from "../utilities/biometricAuth";
import addPurchase from "../utilities/addPurchase"; // Import the biometric authentication function


const Shop = ({user}) => {
    const [userBalance, setUserBalance] = useState(0);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const loadUserBalance = async () => {
            try {
                const balance = await fetchUserBalance(user.uid);
                setUserBalance(balance);
            } catch (error) {
                console.error("Failed to load user balance:", error);
            }
        };

        loadUserBalance();
    }, [user.uid]);

    const shopItems = [
        {
            id: 1,
            name: "Test Resit Pass",
            description: "Resit a test attempt.",
            price: 2000, // Requires 40 actions
        },
        {
            id: 2,
            name: "3 Points Booster",
            description: "Boost your test score by 3 points.",
            price: 1500, // Requires 30 actions
        },
        {
            id: 3,
            name: "Phone Privileges (1 Day)",
            description: "Use your phone for a whole lesson.",
            price: 1000, // Requires 20 actions
        },

        {
            id: 5,
            name: "Test Partner Pass",
            price: 1500, // Requires 24 actions
            description: "Get to choose a partner to sit with you during your next test.",
        },

        {
            id: 7,
            name: "Skip a Test (1 Assignment)",
            price: 5000, // Requires 50 actions
            description: "A coveted reward to skip one test!",
        },
        {
            id: 8,
            name: "Get Hints for Tests",
            price: 1500, // Requires 30 actions
            description: "Receive small hints for upcoming quizzes.",
        },
        {
            id: 9,
            name: "Extra Credit Opportunity",
            price: 3000, // Requires 60 actions
            description: "A one-time chance to boost your grades.",
        },
        {
            id: 10,
            name: "Test Retry with Hints",
            price: 2500, // Requires 50 actions
            description: "Retry a test with added help.",
        },
        {
            id: 11,
            name: "Snack Pass",
            price: 800, // Requires 16 actions
            description: "Bring extra snacks to class.",
        },
        {
            id: 12,
            name: "Assignment Grading Priority",
            price: 1200, // Requires 24 actions
            description: "Get your assignment graded before others!",
        },
        {
            id: 13,
            name: "Redo Test Questions You Missed",
            price: 1800, // Requires 36 actions
            description: "A chance to redo the questions you got wrong.",
        },
        {
            id: 14,
            name: "Funny Hat for the Teacher",
            price: 1000, // Requires 20 actions
            description: "Make the teacher wear a funny hat for the day!",
        },
    ];


    const handlePurchase = async (item) => {
        try {
            // Confirm the purchase
            const isConfirmed = window.confirm(`Are you sure you want to purchase ${item.name} for ${item.price} kitties?`);
            if (!isConfirmed) {
                console.log("Purchase canceled by user.");
                return; // Exit the function if the user cancels
            }

            /*
            // Perform biometric authentication
            const isAuthenticated = await authenticateWithBiometrics();
            if (!isAuthenticated) {
                alert("Biometric authentication failed. Purchase canceled.");
                return;
            }

            console.log("Biometric authentication successful.")
             */

            // Fetch user balance
            if (userBalance >= item.price) {
                const newBalance = userBalance - item.price;
                console.log("New balance after purchase:", newBalance);

                // Update Firestore with the new balance
                await updateUserBalance(user.uid, newBalance);

                setUserBalance(newBalance); // Update local state after successful Firestore update

                await addPurchase(user.uid, item.name, item.price);

                alert(`You purchased ${item.name}! Your new balance is ${newBalance}.`);

                // OPTIONAL: Redirect to the Profile page to refresh the data
                //navigate('/profile'); // Assuming you're using React Router's `useNavigate`
                navigate('/purchases'); // Assuming you're using React Router's `useNavigate`


            } else {
                alert("You do not have enough Kitties to purchase this item.");
            }
        } catch (error) {
            console.error("Error during purchase:", error);
            alert("An error occurred while processing your purchase. Please try again.");
        }
    };

    return (
        <div className="shop-container">
            <h2 className="shop-heading">Your balance is: {userBalance} kitties</h2>
            <div className="shop-items">
                {shopItems.map((item) => (
                    <div key={item.id} className="shop-card">
                        <h3 className="shop-card-title">{item.name}</h3>
                        <p className="shop-card-description">{item.description}</p>
                        <p className="shop-card-price">{item.price} Kitties</p>
                        <button
                            className="shop-card-button"
                            onClick={() => handlePurchase(item)}
                        >
                            Buy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
