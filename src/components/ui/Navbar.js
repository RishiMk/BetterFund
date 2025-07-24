import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const [userType, setUserType] = useState(null);
    const location = useLocation();

    // Re-compute role every time the navbar is rendered
    useEffect(() => {
        const admin = localStorage.getItem('adminLoggedIn') === 'true';
        const user = localStorage.getItem('userLoggedIn') === 'true';

        if (admin) {
            setUserType('admin');
        } else if (user) {
            setUserType('user');
        } else {
            // purge any stale data
            ['adminLoggedIn', 'userLoggedIn', 'userEmail', 'userName', 'userRole', 'userId', 'userType']
                .forEach(k => localStorage.removeItem(k));
            setUserType(null);
        }
    }, [location]);   // also run on route change

    // Listen for login/logout events
    useEffect(() => {
        const onStatus = () => {
            const admin = localStorage.getItem('adminLoggedIn') === 'true';
            const user = localStorage.getItem('userLoggedIn') === 'true';
            setUserType(admin ? 'admin' : user ? 'user' : null);
        };
        window.addEventListener('loginStatusChanged', onStatus);
        return () => window.removeEventListener('loginStatusChanged', onStatus);
    }, []);

    const handleLogout = () => {
        ['adminLoggedIn', 'userLoggedIn', 'userEmail', 'userName', 'userRole', 'userId', 'userType']
            .forEach(k => localStorage.removeItem(k));
        setUserType(null);
        window.location.href = '/';   // hard reload to reset all state
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">🤝 BetterFund</Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/campaign/new" className="nav-button">Create Campaign</Link>

                    {userType === 'admin' ? (
                        <>
                            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
                        </>
                    ) : userType === 'user' ? (
                        <>
                            <Link to="/profile" className="nav-link">My Profile</Link>
                            <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
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