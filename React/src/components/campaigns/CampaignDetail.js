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
        // eslint-disable-next-line
    }, [id]);

    const loadCampaign = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`http://localhost:8081/api/campaign/${id}`);
            if (!res.ok) throw new Error('Campaign not found');
            const data = await res.json();

            // Calculate days left from startDate and endDate
            let daysLeft = 0;
            if (data.endDate) {
                const end = new Date(data.endDate);
                const today = new Date();
                // Set time to midnight for accurate day difference
                end.setHours(0,0,0,0);
                today.setHours(0,0,0,0);
                daysLeft = Math.max(0, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
            }

            // Map backend data to UI structure
            const mappedCampaign = {
                id: data.campaignId,
                name: data.title,
                description: data.description || "No description provided.",
                // image: "/placeholder.jpg", // Replace with data.image if available
                target: data.targetAmt,
                raised: data.wallet?.amount || 0,
                daysLeft: daysLeft,
                category: data.category?.cname || "Uncategorized",
                creatorId: data.user?.username || "Unknown",
                status: data.status,
                createdAt: data.startDate
            };

            setCampaign(mappedCampaign);
        } catch (err) {
            setError(err.message);
            setCampaign(null);
        }
        setLoading(false);
    };

    const handleContribute = async (e) => {
        e.preventDefault();
        setContributing(true);
        setError('');
        setSuccess('');

        try {
            if (!contributionAmount || contributionAmount <= 0) {
                throw new Error('Please enter a valid amount');
            }
            const isLoggedIn = localStorage.getItem('userLoggedIn');
            if (!isLoggedIn) {
                throw new Error('Please login to contribute');
            }
            // Here you would POST to your backend to record the contribution
            setSuccess(`Thank you for your contribution of ₹${contributionAmount}!`);
            setContributionAmount('');
            setShowContributionForm(false);
            setTimeout(() => setSuccess(''), 3000);
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
            'Community': '#38a169',
            'Natural Disaster': '#d69e2e'
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