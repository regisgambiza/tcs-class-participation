import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firestore } from './firebase'; // Your Firebase initialization file
import { getDoc, doc } from 'firebase/firestore';
import './styles/Admin.css'; // Profile component-specific CSS

const AdminPage = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkIfAdmin = async () => {
            const user = JSON.parse(localStorage.getItem('user')); // Assuming user data is stored in localStorage
            if (!user) {
                navigate('/login'); // If the user is not logged in, redirect to login
                return;
            }

            // Check if the user is an admin
            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData(userData);

                if (userData.isAdmin) {
                    setLoading(false);
                } else {
                    navigate('/'); // If not an admin, redirect to the home page
                }
            } else {
                navigate('/login');
            }
        };

        checkIfAdmin();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button onClick={() => navigate('/')} className="logout-button">
                    Logout
                </button>
            </div>
            <div className="admin-content">
                <h2>Welcome, {userData.displayName}</h2>
                <p>You are now in the Admin Dashboard. Here you can manage your app's users, content, and settings.</p>
                <div className="admin-actions">
                    <button className="action-button">Manage Users</button>
                    <button className="action-button">View Reports</button>
                    <button className="action-button">Settings</button>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
