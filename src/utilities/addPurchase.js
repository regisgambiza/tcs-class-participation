// src/utilities/addPurchase.js
import { firestore } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const addPurchase = async (userId, itemName, price) => {
    try {
        const purchaseDate = Timestamp.now();
        const validUntil = new Timestamp(purchaseDate.seconds + 86400, 0); // 86400 seconds = 1 day

        // Add the purchase to the Firestore collection
        await addDoc(collection(firestore, 'purchases'), {
            userId,
            itemName,
            price,
            purchaseDate,
            validUntil,
        });

        console.log("Purchase added successfully.");
    } catch (error) {
        console.error("Error adding purchase:", error);
    }
};

export default addPurchase;
