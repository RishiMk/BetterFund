import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthAPI } from './auth';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        console.log(' Login form submitted');

        try {
            const responseData = await AuthAPI.login(formData.email, formData.password);
            console.log(' Login API response:', responseData);

            if (responseData.success) {
                const user = responseData.user;
                const token = responseData.token;

                // Store token and user info
                localStorage.setItem('token', token);
                
                localStorage.setItem('userLoggedIn', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userName', user.username);
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('userId', user.id.toString());
                localStorage.setItem('adminLoggedIn', user.isAdmin ? 'true' : 'false');
                localStorage.setItem('userType', user.isAdmin ? 'admin' : 'user');
          

                window.dispatchEvent(new Event('loginStatusChanged'));
                alert(' Login successful!');

                navigate(user.isAdmin ? '/admin/dashboard' : '/');
            } else {
                setError(responseData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error(' Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            
            <div className="form-container">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
  <img src='/BetterFundLogo.png' alt="Website Logo" width="70" height="70" />
  <h5>BetterFund</h5>
</div>


                <h1>Login</h1>
                <br/>
                {/* <p>Sign in to access your BetterFund account or admin panel.</p> */}

                {error && <div className="alert alert-error">{error}</div>}

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
                        <button type="submit" className="btn"  disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

             
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p>Don't have an account? <Link to="/register" style={{ color: '#2c7a7b', textDecoration: 'none' }}>Sign Up</Link></p>
                </div>
            </div>
                
        </div>
    );
}
