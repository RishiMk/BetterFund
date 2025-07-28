import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserProfile() {
    const [userCampaigns, setUserCampaigns] = useState([]);
    const [userContributions, setUserContributions] = useState([]);
    const [userProfile, setUserProfile] = useState({
        name: 'John Doe',
        email: 'user@betterfund.com',
        totalContributed: 0,
        campaignsCreated: 0,
        joinDate: '2024-01-01'
    });
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('userLoggedIn');
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // Load user data
        loadUserData();
    }, [navigate]);

    const loadUserData = () => {
        // Get user data from localStorage
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');

        // Check if this is a registered user
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const currentUser = registeredUsers.find(user => user.email === userEmail);

        if (currentUser) {
            // Use actual user data
            setUserProfile({
                name: currentUser.name,
                email: currentUser.email,
                totalContributed: currentUser.totalContributed || 0,
                campaignsCreated: currentUser.campaignsCreated || 0,
                joinDate: currentUser.joinDate,
                phone: currentUser.phone,
                address: currentUser.address
            });
        } else {
            // Use demo user data
            setUserProfile({
                name: 'John Doe',
                email: 'user@betterfund.com',
                totalContributed: 0,
                campaignsCreated: 0,
                joinDate: '2024-01-01'
            });
        }

        // Sample user campaigns data
        const sampleUserCampaigns = [
            {
                id: 1,
                name: "Help Build a Community Library",
                status: "active",
                balance: 45000,
                target: 100000,
                contributors: 45,
                requests: 2,
                createdAt: "2024-01-15",
                description: "We're raising funds to build a public library in our local community."
            },
            {
                id: 2,
                name: "Local Food Bank Support",
                status: "pending",
                balance: 0,
                target: 50000,
                contributors: 0,
                requests: 0,
                createdAt: "2024-01-28",
                description: "Supporting local food banks to provide meals for families in need."
            }
        ];

        // Sample user contributions data
        const sampleUserContributions = [
            {
                id: 1,
                campaignId: 3,
                campaignName: "Clean Water Project",
                amount: 5000,
                date: "2024-01-20",
                status: "completed"
            },
            {
                id: 2,
                campaignId: 5,
                campaignName: "Disaster Relief Fund",
                amount: 2000,
                date: "2024-01-18",
                status: "completed"
            },
            {
                id: 3,
                campaignId: 6,
                campaignName: "Senior Care Center",
                amount: 1500,
                date: "2024-01-22",
                status: "completed"
            }
        ];

        setUserCampaigns(sampleUserCampaigns);
        setUserContributions(sampleUserContributions);

        // Calculate user stats
        const totalContributed = sampleUserContributions.reduce((sum, contribution) => sum + contribution.amount, 0);
        setUserProfile(prev => ({
            ...prev,
            totalContributed: totalContributed,
            campaignsCreated: sampleUserCampaigns.length
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userType');
        navigate('/login');
    };

    const handleCreateCampaign = () => {
        navigate('/campaign/new');
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>My Profile</h1>
                <div>
                    <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                        Back to Home
                    </Link>
                    <button onClick={handleLogout} className="btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={{
                display: 'flex',
                borderBottom: '2px solid #e2e8f0',
                marginBottom: '2rem',
                gap: '0'
            }}>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        background: activeTab === 'profile' ? '#2c7a7b' : 'transparent',
                        color: activeTab === 'profile' ? 'white' : '#4a5568',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'profile' ? '2px solid #2c7a7b' : 'none',
                        marginBottom: '-2px'
                    }}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('campaigns')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        background: activeTab === 'campaigns' ? '#2c7a7b' : 'transparent',
                        color: activeTab === 'campaigns' ? 'white' : '#4a5568',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'campaigns' ? '2px solid #2c7a7b' : 'none',
                        marginBottom: '-2px'
                    }}
                >
                    My Campaigns
                </button>
                <button
                    onClick={() => setActiveTab('contributions')}
                    style={{
                        padding: '1rem 2rem',
                        border: 'none',
                        background: activeTab === 'contributions' ? '#2c7a7b' : 'transparent',
                        color: activeTab === 'contributions' ? 'white' : '#4a5568',
                        cursor: 'pointer',
                        borderBottom: activeTab === 'contributions' ? '2px solid #2c7a7b' : 'none',
                        marginBottom: '-2px'
                    }}
                >
                    My Contributions
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
                <div>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <div className="card-content">
                            <h2>Profile Information</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                <div>
                                    <p><strong>Name:</strong> {userProfile.name}</p>
                                    <p><strong>Email:</strong> {userProfile.email}</p>
                                    <p><strong>Member Since:</strong> {userProfile.joinDate}</p>
                                </div>
                                <div>
                                    <p><strong>Total Contributed:</strong> ₹{userProfile.totalContributed.toLocaleString()}</p>
                                    <p><strong>Campaigns Created:</strong> {userProfile.campaignsCreated}</p>
                                    <p><strong>Account Status:</strong> <span style={{ color: '#2c7a7b', fontWeight: 'bold' }}>Active</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="card">
                            <div className="card-content">
                                <h3>Total Contributed</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                                    ₹{userProfile.totalContributed.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                                <h3>Campaigns Created</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                                    {userProfile.campaignsCreated}
                                </p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                                <h3>Active Campaigns</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                                    {userCampaigns.filter(c => c.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <h2>Quick Actions</h2>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={handleCreateCampaign} className="btn">
                                Create New Campaign
                            </button>
                            <Link to="/" className="btn btn-secondary">
                                Browse Campaigns
                            </Link>
                            <Link to="/report-issues" className="btn btn-secondary">
                                Report Issue
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            {activeTab === 'campaigns' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>My Campaigns</h2>
                        <button onClick={handleCreateCampaign} className="btn">
                            Create New Campaign
                        </button>
                    </div>

                    {userCampaigns.length > 0 ? (
                        <div className="grid">
                            {userCampaigns.map(campaign => (
                                <div key={campaign.id} className="card">
                                    <div className="card-content">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <h3>{campaign.name}</h3>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: campaign.status === 'active' ? '#d4edda' : '#fff3cd',
                                                color: campaign.status === 'active' ? '#155724' : '#856404'
                                            }}>
                                                {campaign.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ marginBottom: '1rem', color: '#718096' }}>{campaign.description}</p>
                                        <p><strong>Raised:</strong> ₹{campaign.balance.toLocaleString()} / ₹{campaign.target.toLocaleString()}</p>
                                        <p><strong>Contributors:</strong> {campaign.contributors}</p>
                                        <p><strong>Requests:</strong> {campaign.requests}</p>
                                        <p><strong>Created:</strong> {campaign.createdAt}</p>
                                        <div style={{ marginTop: '1rem' }}>
                                            <Link to={`/campaign/${campaign.id}`} className="btn" style={{ marginRight: '0.5rem' }}>
                                                View Details
                                            </Link>
                                            <Link to={`/campaign/${campaign.id}/requests`} className="btn btn-secondary">
                                                Manage Requests
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>You haven't created any campaigns yet.</p>
                            <button onClick={handleCreateCampaign} className="btn">
                                Create your first campaign
                            </button>
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'contributions' && (
                <div>
                    <h2>My Contributions</h2>
                    {userContributions.length > 0 ? (
                        <div className="grid">
                            {userContributions.map(contribution => (
                                <div key={contribution.id} className="card">
                                    <div className="card-content">
                                        <h3>{contribution.campaignName}</h3>
                                        <p><strong>Amount:</strong> ₹{contribution.amount.toLocaleString()}</p>
                                        <p><strong>Date:</strong> {contribution.date}</p>
                                        <p><strong>Status:</strong>
                                            <span style={{
                                                marginLeft: '0.5rem',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                background: '#d4edda',
                                                color: '#155724'
                                            }}>
                                                {contribution.status.toUpperCase()}
                                            </span>
                                        </p>
                                        <Link to={`/campaign/${contribution.campaignId}`} className="btn">
                                            View Campaign
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>You haven't made any contributions yet.</p>
                            <Link to="/" className="btn">
                                Browse campaigns
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 