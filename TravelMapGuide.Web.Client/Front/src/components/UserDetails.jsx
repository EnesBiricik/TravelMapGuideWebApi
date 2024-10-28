import React, { useState, useEffect } from 'react';

const UserDetails = ({ userData, userTravels }) => {
    if (!userData) return null;
    return (
        <div style={styles.padding}>
            <img
                src={userData.imageUrl ? `http://localhost:7018/img/${userData.imageUrl}` : '/path/to/default-profile.jpg'}
                alt={userData.username || 'Profile'}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <h1 style={styles.title}>{userData.username || 'Unknown User'}</h1>
            <h3>User's Travels:</h3>
            <ul>
                {userTravels.map(travel => (
                    <li key={travel.id}>
                        {travel.name} - {travel.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    padding: {
        padding: '1rem',
    },
    title: {
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '10px',
    },
};

export default UserDetails;
