import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CampaignDetail() {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contributionAmount, setContributionAmount] = useState('');
    const [showContributionForm, setShowContributionForm] = useState(false);
    const [contributing, setContributing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadCampaign();
    }, [id]);

    const loadCampaign = () => {
        // load campaign data from localStorage
        const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');

        // also check sample campaigns if not found in localStorage
        const sampleCampaigns = [
            {
                id: 0,
                name: "Help My Father's Heart Surgery",
                description: "My father needs an urgent heart surgery. We've exhausted all our savings and need your support to save his life. Every contribution matters and will help us cover the surgery costs, hospital stay, and post-operative care.",
                image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
                target: 500000,
                raised: 25000,
                contributors: 12,
                daysLeft: 30,
                category: "Medical",
                creatorId: "Rahul Sharma",
                status: "active",
                requestsCount: 0,
                createdAt: "2024-01-25"
            },
            {
                id: 1,
                name: "My Daughter's Education Fund",
                description: "My daughter got admission to a prestigious engineering college but we can't afford the fees. Please help her achieve her dreams. The funds will cover tuition fees, books, and accommodation for the first year.",
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&h=300&q=80",
                target: 200000,
                raised: 15000,
                contributors: 8,
                daysLeft: 45,
                category: "Education",
                creatorId: "Priya Patel",
                status: "active",
                requestsCount: 0,
                createdAt: "2024-01-22"
            },
            {
                id: 2,
                name: "Start My Small Business",
                description: "I want to start a small tailoring business to support my family. I have the skills but need funds for equipment and initial setup. This will help me become self-employed and provide for my children.",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
                target: 80000,
                raised: 12000,
                contributors: 23,
                daysLeft: 20,
                category: "Personal",
                creatorId: "Meera Singh",
                status: "active",
                requestsCount: 0,
                createdAt: "2024-01-28"
            },
            {
                id: 3,
                name: "Community Library for Our Village",
                description: "We want to build a small library in our village so children can study and access books. This will help improve education in our area and provide a safe space for learning.",
                image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
                target: 80000,
                raised: 30000,
                contributors: 45,
                daysLeft: 15,
                category: "Community",
                creatorId: "Local Youth Group",
                status: "active",
                requestsCount: 2,
                createdAt: "2024-01-15"
            }
        ];

        // Ensure id is always compared as a number
        const campaignId = Number(id);
        const foundCampaign = campaigns.find(c => Number(c.id) === campaignId) || sampleCampaigns.find(c => Number(c.id) === campaignId);

        if (foundCampaign) {
            setCampaign(foundCampaign);
        } else {
            setError('Campaign not found');
        }

        setLoading(false);
    };

    const handleContribute = async (e) => {
        e.preventDefault();
        setContributing(true);
        setError('');
        setSuccess('');

        try {
            // basic validation
            if (!contributionAmount || contributionAmount <= 0) {
                throw new Error('Please enter a valid amount');
            }

            // check if user is logged in
            const isLoggedIn = localStorage.getItem('userLoggedIn');
            if (!isLoggedIn) {
                throw new Error('Please login to contribute');
            }

            // update campaign data
            const updatedCampaign = {
                ...campaign,
                raised: campaign.raised + parseFloat(contributionAmount),
                contributors: campaign.contributors + 1
            };

            // save updated campaign
            const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
            const updatedCampaigns = campaigns.map(c =>
                c.id == id ? updatedCampaign : c
            );
            localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));

            setCampaign(updatedCampaign);
            setSuccess(`Thank you for your contribution of ₹${contributionAmount}!`);
            setContributionAmount('');
            setShowContributionForm(false);

            // hide success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
            }, 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setContributing(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getProgressPercentage = (raised, target) => {
        return Math.min((raised / target) * 100, 100);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Medical': '#e53e3e',
            'Education': '#3182ce',
            'Personal': '#805ad5',
            'Community': '#38a169'
        };
        return colors[category] || '#718096';
    };

    if (loading) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading campaign details...</p>
                </div>
            </div>
        );
    }

    if (error && !campaign) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Campaign Not Found</h2>
                    <p>{error}</p>
                    <Link to="/" className="btn">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {campaign && (
                <>
                    {/* campaign header */}
                    <div className="campaign-header">
                        <div className="campaign-image">
                            <img src={campaign.image} alt={campaign.name} />
                        </div>
                        <div className="campaign-info">
                            <h1>{campaign.name}</h1>
                            <span style={{
                                background: getCategoryColor(campaign.category),
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '1rem',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                display: 'inline-block',
                                marginBottom: '0.5rem'
                            }}>
                                {campaign.category}
                            </span>
                            <p className="campaign-creator">by {campaign.creatorId}</p>
                        </div>
                    </div>

                    {/* campaign stats */}
                    <div className="campaign-stats">
                        <div className="stat-card">
                            <h3>Raised</h3>
                            <p className="stat-value">{formatCurrency(campaign.raised)}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Target</h3>
                            <p className="stat-value">{formatCurrency(campaign.target)}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Contributors</h3>
                            <p className="stat-value">{campaign.contributors}</p>
                        </div>
                        <div className="stat-card">
                            <h3>Days Left</h3>
                            <p className="stat-value">{campaign.daysLeft}</p>
                        </div>
                    </div>

                    {/* progress bar */}
                    <div className="progress-section">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${getProgressPercentage(campaign.raised, campaign.target)}%` }}
                            ></div>
                        </div>
                        <p className="progress-text">
                            {getProgressPercentage(campaign.raised, campaign.target).toFixed(1)}% of goal reached
                        </p>
                    </div>

                    {/* contribution form */}
                    {showContributionForm && (
                        <div className="contribution-form">
                            <h3>Make a Contribution</h3>
                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}

                            <form onSubmit={handleContribute}>
                                <div className="form-group">
                                    <label htmlFor="amount" className="form-label">Amount (₹)</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={contributionAmount}
                                        onChange={(e) => setContributionAmount(e.target.value)}
                                        className="form-input"
                                        placeholder="Enter amount"
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={contributing}
                                    >
                                        {contributing ? 'Processing...' : 'Contribute'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowContributionForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* action buttons */}
                    {!showContributionForm && (
                        <div className="action-buttons">
                            <button
                                onClick={() => setShowContributionForm(true)}
                                className="btn btn-primary"
                            >
                                Contribute Now
                            </button>
                            <Link to={`/campaign/${id}/requests`} className="btn btn-secondary">
                                View Requests ({campaign.requestsCount})
                            </Link>
                        </div>
                    )}

                    {/* campaign description */}
                    <div className="campaign-description">
                        <h2>About This Campaign</h2>
                        <p>{campaign.description}</p>
                    </div>

                    {/* campaign details */}
                    <div className="campaign-details">
                        <h3>Campaign Details</h3>
                        <div className="details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Created:</span>
                                <span className="detail-value">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Status:</span>
                                <span className="detail-value">{campaign.status}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Category:</span>
                                <span className="detail-value">{campaign.category}</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 