import React from 'react';
import './styles/Shop.css'; // Add styling for the shop
import { useState, useEffect } from "react";
import updateUserBalance from "../utilities/updateUserBalance";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import fetchUserBalance from "../utilities/fetchUserBalance"; // Adjust path as necessary

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
            price: 800,
        },
        {
            id: 2,
            name: "3 Points Booster",
            description: "Boost your test score by 3 points.",
            price: 500,
        },
        {
            id: 3,
            name: "Phone Privileges (1 Day)",
            description: "Use your phone for a whole day.",
            price: 200,
        },
        {
            name: 'Personalized Greeting Animation',
            price: 550,
            description: 'Unlock a personalized greeting animation on your profile page.',
        },
        {
            name: 'Test Partner Pass',
            price: 400,
            description: 'Get to choose a partner to sit with you during your next test.',
        },
        {
            name: 'Mystery Box Reward',
            price: 800, // Starting price
            description: 'Buy a Mystery Box and get a random surprise! (Value may vary)',
            isVariable: true, // Indicates that the price can vary
        },
    ];

    const handlePurchase = async (item) => {
        try {

            // Fetch user balance
            if (userBalance >= item.price) {
                const newBalance = userBalance - item.price;
                console.log("New balance after purchase:", newBalance);

                // Update Firestore with the new balance
                await updateUserBalance(user.uid, newBalance);

                setUserBalance(newBalance); // Update local state after successful Firestore update

                alert(`You purchased ${item.name}! Your new balance is ${newBalance}.`);

                // OPTIONAL: Redirect to the Profile page to refresh the data
                navigate('/profile'); // Assuming you're using React Router's `useNavigate`
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
            <h2 className="shop-heading">Shop</h2>
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
