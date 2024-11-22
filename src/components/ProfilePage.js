import React from 'react';

const ProfilePage = ({ user }) => {
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome to your Profile, {user.displayName}!</h1>
            <p>Email: {user.email}</p>
        </div>
    );
};

export default ProfilePage;
