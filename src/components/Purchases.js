import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import './styles/Purchases.css';  // Import the Purchases page CSS

const Purchases = ({ userId }) => {
    const [purchases, setPurchases] = useState([]);

    // Fetch purchases made by the user
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const q = query(
                    collection(firestore, 'purchases'),
                    where('userId', '==', userId)  // Fetch purchases for the logged-in user
                );

                const querySnapshot = await getDocs(q);
                const purchasesList = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const validUntil = data.validUntil.toDate();

                    // Check if the purchase is valid for the current day (24-hour window)
                    const isValid = validUntil > new Date();

                    if (isValid) {
                        purchasesList.push({ id: doc.id, ...data });
                    }
                });

                setPurchases(purchasesList);
            } catch (error) {
                console.error("Error fetching purchases:", error);
            }
        };

        fetchPurchases();
    }, [userId]);

    return (
        <div className="purchases-container">
            <h2 className="purchases-heading">Your Purchases</h2>
            <div className="purchase-list">
                {purchases.length === 0 ? (
                    <div className="purchase-empty">You have no valid purchases yet.</div>
                ) : (
                    purchases.map((purchase) => (
                        <div key={purchase.id} className="purchase-card">
                            <h3 className="purchase-card-title">{purchase.itemName}</h3>
                            <p className="purchase-card-description">Price: {purchase.price} Kitties</p>
                            <p className="purchase-card-description">
                                Purchase Date: {purchase.purchaseDate.toDate().toLocaleString()}
                            </p>
                            <p className="purchase-card-description">
                                Valid Until: {purchase.validUntil.toDate().toLocaleString()}
                            </p>
                            <div className="purchase-status">
                                {purchase.validUntil.toDate() > new Date() ? 'Active' : 'Expired'}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Purchases;

