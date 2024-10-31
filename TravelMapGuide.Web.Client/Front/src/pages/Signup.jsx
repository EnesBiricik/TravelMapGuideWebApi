/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/auth.css';
import { API_ENDPOINTS } from '../constants/Endpoints';

function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [tempPhotoUrl, setTempPhotoUrl] = useState(null);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setProfilePhoto(file);
            setTempPhotoUrl(fileUrl);
            console.error("profilePhoto:", file);
        }
    };

    const handleLogin = () => {
        navigate('/login')
    }

    useEffect(() => {
        return () => {
            if (tempPhotoUrl) {
                URL.revokeObjectURL(tempPhotoUrl);
            }
        };
    }, [tempPhotoUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Email', email);
        formData.append('Username', username);
        formData.append('Password', password);
        formData.append('Image', profilePhoto);

        try {
            const response = await axios.post(`${API_ENDPOINTS.DEFAULT_URL}api/User/Register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('Registration successful');
                navigate('/login');
            }
        } catch (error) {
            console.error('An error occurred!', error);
            alert('Registration failed. Please check your details and try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className='row signup-form'>
                <div className="col-lg-6">
                    <div className="imageDiv"></div>
                </div>
                <div className="col-lg-6">
                    <h2 className='auth-header'>Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="profilePhoto">Profile Photo:</label>
                            <div
                                className="image-upload-box"
                                onClick={() => document.getElementById('profilePhoto').click()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '150px',
                                    border: '2px dashed #ccc',
                                    cursor: 'pointer',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundImage: tempPhotoUrl ? `url(${tempPhotoUrl})` : 'none',
                                }}
                            >
                                {!tempPhotoUrl && (
                                    <span style={{ fontSize: '24px', color: '#ccc' }}>+</span>
                                )}
                            </div>
                            <input
                                type="file"
                                id="profilePhoto"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary"><b>Sign Up</b></button>
                        <p className='auth-route' onClick={() => handleLogin()}>Do you have an account? Sign in</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
