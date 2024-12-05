import React, { useEffect, useState } from 'react'; // React and necessary hooks
import QRScanner from './QRScanner'; // QRScanner component
import { firestore } from '../firebase'; // Firebase Firestore instance
import {doc, getDoc, deleteDoc, updateDoc, collection, query, where, getDocs, orderBy, limit} from 'firebase/firestore'; // Firestore utilities
import { useNavigate } from 'react-router-dom'; // For navigation
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library'; // ZXing for QR code scanning
import './styles/Profile.css'; // Profile component-specific CSS



function Profile({ user, selectedClass, balance }) {
    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [localBalance, setLocalBalance] = useState(balance);  // Local balance state
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);

    // Inside Profile.js

    useEffect(() => {
        // Function to fetch the latest balance
        const fetchBalance = async () => {
            try {
                const userRef = doc(firestore, 'users', user.uid); // Reference to user's document
                const userSnap = await getDoc(userRef); // Fetch the document

                if (userSnap.exists()) {
                    const userData = userSnap.data(); // Get user data
                    setLocalBalance(userData.balance || 0); // Update the local balance state
                } else {
                    console.error('User document not found.');
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };

        fetchBalance(); // Fetch balance when the component mounts
    }, [user]); // Dependency array ensures it runs when `user` changes



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

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!selectedClass) {
                console.error('No class selected for the leaderboard.');
                return;
            }

            try {
                const leaderboardQuery = query(
                    collection(firestore, 'users'),
                    where('class', '==', selectedClass), // Filter by the selected class
                    orderBy('balance', 'desc'),
                    limit(5)
                );

                const querySnapshot = await getDocs(leaderboardQuery);
                const leaderboardData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        };

        fetchLeaderboard();
    }, [selectedClass]); // Re-fetch leaderboard if the selected class changes


    return (
    <div className="profile-container">
        <h2 className="profile-header">Welcome, {user?.displayName || 'User'}!</h2>
        <p className="profile-info">Email: {user?.email}</p>
        <p className="profile-info">Class: {selectedClass}</p>
        <p className="profile-balance">Balance: {localBalance} Hello-Kitties</p> {/* Display updated balance from local state */}

        {/* Leaderboard Section */}
    <div className="leaderboard-container">
        <h3>Leaderboard</h3>
        <ul className="leaderboard-list">
            {leaderboard.map((learner, index) => (
                <li key={learner.id} className="leaderboard-item">
                    {index === 0 && (
                        <span className="crown-icon" role="img" aria-label="crown">
                            👑
                        </span>
                    )}
                    <span className="learner-name">{learner.displayName || "Anonymous User"}</span> -
                    <span className="learner-balance">{learner.balance} HK</span>
                </li>
            ))}
        </ul>
    </div>


        {/* QR scanner toggle button */}
        <button className="profile-button" onClick={() => setScanning(!scanning)}>
            {scanning ? 'Stop Scanning' : 'Start Scanning QR Code'}
        </button>

        {/* Show QR scanner when scanning is true */}
        {scanning && <QRScanner onScan={handleScan} stopScanning={() => setScanning(false)} />}

        {/* Option to scan QR code from image */}
        <button
            className="profile-button"
            onClick={() => document.getElementById('uploadImage').click()}
        >
            Scan QR Code from Image
        </button>
        <input
            type="file"
            accept="image/*"
            className="profile-upload"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
            id="uploadImage"
        />

        {/* Display message */}
        {message && <p className="profile-message">{message}</p>}
    </div>
);}

export default Profile;
