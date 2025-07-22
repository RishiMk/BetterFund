import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [userType, setUserType] = useState(null);
    // Clear any leftover login state on first run
    useEffect(() => {
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        const userLoggedIn = localStorage.getItem('userLoggedIn');
        if (!adminLoggedIn && !userLoggedIn) {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('adminEmail');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
            setUserType(null); // Force userType to null
        }
    }, []);
    const location = useLocation();

    const checkLoginStatus = () => {
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        const userLoggedIn = localStorage.getItem('userLoggedIn');

        if (adminLoggedIn) {
            setUserType('admin');
        } else if (userLoggedIn) {
            setUserType('user');
        } else {
            setUserType(null);
        }
    };

    useEffect(() => {
        // Check login status on component mount
        checkLoginStatus();

        // Listen for storage changes (when login/logout happens)
        const handleStorageChange = (e) => {
            if (e.key === 'adminLoggedIn' || e.key === 'userLoggedIn' || e.key === 'userType') {
                checkLoginStatus();
            }
        };

        // Listen for custom login status change event
        const handleLoginStatusChange = () => {
            checkLoginStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('loginStatusChanged', handleLoginStatusChange);

        // Also check on route changes (in case login redirects)
        checkLoginStatus();

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
        };
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        setUserType(null);
        window.location.reload(); // Refresh to update navbar
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🤝 BetterFund
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/campaign/new" className="nav-button">Create Campaign</Link>

                    {userType === 'admin' ? (
                        <>
                            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </>
                    ) : userType === 'user' ? (
                        <>
                            <Link to="/profile" className="nav-link">My Profile</Link>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-button">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
} 