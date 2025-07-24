import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthAPI } from './auth'; // Import AuthAPI

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
        setError('');
        console.log('Login form submitted'); // Debug log

        try {
            // Use AuthAPI for login
            const responseData = await AuthAPI.login(formData.email, formData.password);
            console.log('Login API response:', responseData); // Debug log

            if (responseData.success) {
                const user = responseData.user;

                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userName', user.username);
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.id.toString());

                if (user.isAdmin) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('userType', 'admin');
                } else {
                    localStorage.setItem('adminLoggedIn', 'false');
                    localStorage.setItem('userType', 'user');
                }

                window.dispatchEvent(new Event('loginStatusChanged'));
                alert('Login successful');

                if (user.isAdmin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError(responseData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
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
                        <h4>Example Admin Access:</h4>
                        <p><strong>Email:</strong> admin@betterfund.com</p>
                        <p><strong>Password:</strong> admin123</p>
                        <hr style={{ margin: '7px 0' }} />
                        <h4>Example user Access:</h4>
                        <p><strong>Email:</strong> test@example.com</p>
                        <p><strong>Password:</strong> password123</p>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: '#2c7a7b', textDecoration: 'none' }}>Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}