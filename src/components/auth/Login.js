import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Replace with actual API call for authentication
            // For demo purposes, using hardcoded credentials and registered users

            // Admin credentials
            if (formData.email === 'admin@betterfund.com' && formData.password === 'admin123') {
                // Store admin session
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', formData.email);
                localStorage.setItem('userType', 'admin');

                // Dispatch custom event to update navbar
                window.dispatchEvent(new Event('loginStatusChanged'));

                // Redirect to admin dashboard
                navigate('/admin/dashboard');
                return;
            }

            // Demo user credentials
            if (formData.email === 'user@betterfund.com' && formData.password === 'user123') {
                // Store user session
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', formData.email);
                localStorage.setItem('userType', 'user');

                // Dispatch custom event to update navbar
                window.dispatchEvent(new Event('loginStatusChanged'));

                // Redirect to home page for regular users
                navigate('/');
                return;
            }

            // Check registered users
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = registeredUsers.find(u => u.email === formData.email && u.password === formData.password);

            if (user) {
                // Store user session
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userType', 'user');
                localStorage.setItem('userName', user.name);

                // Dispatch custom event to update navbar
                window.dispatchEvent(new Event('loginStatusChanged'));

                // Redirect to home page for regular users
                navigate('/');
                return;
            }

            // If no matching credentials
            setError('Invalid email or password. Please try again.');

        } catch (error) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Login</h1>
                <p>Sign in to access your BetterFund account or admin panel.</p>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="demo-credentials">
                    <h3>Demo Credentials:</h3>
                    <div style={{ marginBottom: '1rem' }}>
                        <h4>Admin Access:</h4>
                        <p><strong>Email:</strong> admin@betterfund.com</p>
                        <p><strong>Password:</strong> admin123</p>
                    </div>
                    <div>
                        <h4>Demo User Access:</h4>
                        <p><strong>Email:</strong> user@betterfund.com</p>
                        <p><strong>Password:</strong> user123</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: '#2c7a7b', textDecoration: 'none' }}>Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
} 