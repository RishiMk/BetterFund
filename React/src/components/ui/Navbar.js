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
                <Link to="/" className="nav-logo">
                <table>
                    <tr>
                        <td><img src='/BetterFundLogo.png' alt="Website Logo" width="50" height="50"/></td>
                        <td>BetterFund</td>
                    </tr>
                </table>
                
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link" style={{marginRight: '1rem'}}>Home</Link>
                    <Link to="/campaign/new" className="btn" style={{marginRight: '1rem'}}>Create Campaign</Link>

                    {userType === 'admin' ? (
                        <>
                            <Link to="/admin/dashboard" className="btn" style={{marginRight: '1rem'}}>Admin Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                        </>
                    ) : userType === 'user' ? (
                        <>
                            <Link to="/profile" className="btn" style={{marginRight: '1rem'}}>My Profile</Link>
                            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary" style={{marginRight: '1rem'}}>Login</Link>
                            <Link to="/register" className="btn">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}