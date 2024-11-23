// src/components/Profile.js
import React, { useState } from 'react';
import QRScanner from './QRScanner';  // Correct import for QRScanner
import { firestore } from '../firebase';  // Correct import for Firebase
import { doc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';  // Import ZXing libraries

function Profile({ user, selectedClass, balance }) {
    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [localBalance, setLocalBalance] = useState(balance);  // Local balance state
    const navigate = useNavigate();

    // Handle QR scan result from QRScanner component
    const handleScan = async (qrCodeId) => {
        console.log('Searching for QR Code ID:', qrCodeId); // Debug log to check what ID is being searched in Firestore
        try {
            // Query Firestore for the document where qrCodeId matches the scanned value
            const q = query(collection(firestore, 'qr_codes'), where('qrCodeId', '==', qrCodeId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Retrieve the first document that matches (assuming qrCodeId is unique)
                const qrCodeDoc = querySnapshot.docs[0];
                const qrCodeData = qrCodeDoc.data();
                console.log('QR Code data:', qrCodeData);  // Debug log to check QR code data
                const amount = Number(qrCodeData.amount); // Ensure amount is a number

                // Update user's balance
                const userRef = doc(firestore, 'users', user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    console.log('User data:', userData);  // Debug log to check user data
                    const currentBalance = Number(userData.balance) || 0; // Ensure balance is a number
                    const newBalance = currentBalance + amount;

                    await updateDoc(userRef, { balance: newBalance });
                    await deleteDoc(qrCodeDoc.ref); // Delete QR code after successful use

                    // Update local balance immediately
                    setLocalBalance(newBalance);  // Update the local balance state
                    setMessage('Balance successfully updated!');
                    setScanning(false);
                    navigate('/profile');
                } else {
                    setMessage('User not found.');
                }
            } else {
                setMessage('Invalid QR Code: No data found.');
            }
        } catch (error) {
            console.error('Error processing QR code:', error);
            setMessage('Error processing QR code.');
        }
    };


    // Handle QR code scan from image
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setFile(file); // Save the file

        if (file) {
            try {
                const reader = new BrowserMultiFormatReader();
                const img = new Image();
                img.src = URL.createObjectURL(file);

                img.onload = async () => {
                    try {
                        const result = await reader.decodeFromImage(img);
                        const qrCodeId = result.getText(); // Extract the QR code ID from the scanned result
                        console.log('Scanned QR Code ID:', qrCodeId); // Debug log to check the QR code ID
                        handleScan(qrCodeId); // Process the scanned QR code id
                    } catch (err) {
                        if (err instanceof NotFoundException) {
                            setMessage('QR Code not found in the image.');
                        } else {
                            setMessage('Error scanning QR code from image.');
                            console.error("Error scanning QR code from image:", err);
                        }
                    }
                };
            } catch (error) {
                console.error('Error reading QR code from image:', error);
                setMessage('Error reading QR code from image.');
            }
        }
    };

    return (
        <div>
            <h2>Welcome, {user?.displayName || 'User'}!</h2>
            <p>Email: {user?.email}</p>
            <p>Class: {selectedClass}</p>
            <p>Balance: ${localBalance}</p> {/* Display updated balance from local state */}

            {/* QR scanner toggle button */}
            <button onClick={() => setScanning(!scanning)}>
                {scanning ? 'Stop Scanning' : 'Start Scanning QR Code'}
            </button>

            {/* Show QR scanner when scanning is true */}
            {scanning && <QRScanner onScan={handleScan} stopScanning={() => setScanning(false)} />}

            {/* Option to scan QR code from image */}
            <button
                onClick={() => document.getElementById('uploadImage').click()}

            >
                Scan QR Code from Image
            </button>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                id="uploadImage"
            />

            {/* Display message */}
            {message && <p>{message}</p>}
        </div>
    );
}

export default Profile;
