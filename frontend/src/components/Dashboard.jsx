import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/Dashboard.css';
import { ACCESS_TOKEN } from '../token';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = localStorage.getItem(ACCESS_TOKEN);
                if (!accessToken) {
                    throw new Error('No access token found');
                }

                const headers = {
                    Authorization: `Bearer ${accessToken}`,
                }

                // Fetch user data
                const userResponse = await api.get('http://127.0.0.1:8000/dashboard/', {headers})
                const user = userResponse.data;
                setUserData(user);
                setIsAdmin(user.is_staff);
            } catch(error){
                console.error('Error fetching user data:', error);
                const errorMessage = error.response
                    ? error.response.data.detail || 'An error occurred while fetching user data'
                    : 'An error occurred: ' + error.message;
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    // set loading or error handing
    if (loading) return <p>Loading .....</p>
    if (error) return <p className="error-message">{error}</p>


    // set up function to render user data
    const renderUserData  = () => (
        <div>
            <h2>Welcome, {userData.username}!</h2>
            {isAdmin && <p> You are an Admin</p>}
            <p>Status : {userData.is_active ? 'Active' : 'Inative'}</p>
        </div>
    )

    const renderAdminFeatures = () => (
        <div>
            <h3>Admin Features</h3>
            {/* Add more admin features here */}
            <div className="admin-actions"> 
                <button onClick={() => window.location.href = "api/products"}>Manage Products</button>
            </div>
        </div>
    )

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            {renderUserData()}
            {isAdmin && renderAdminFeatures()}
        </div>
    );
};

export default Dashboard;