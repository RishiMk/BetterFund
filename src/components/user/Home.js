import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CampaignCard({
    name,
    description,
    creatorId,
    imageURL,
    id,
    balance,
    target,
    category,
}) {
    const progressPercentage = target > 0 ? (balance / target) * 100 : 0;

    return (
        <Link to={`/campaign/${id}`} style={{ textDecoration: 'none' }}>
            <div className="card">
                <img src={imageURL} alt={name} className="card-image" />
                <div className="card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{
                            background: getCategoryColor(category),
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                        }}>
                            {category}
                        </span>
                    </div>
                    <h3 className="card-title">{name}</h3>
                    <p className="card-description">{description}</p>
                    <p style={{ marginBottom: '0.5rem' }}>
                        <strong>₹{balance.toLocaleString()}</strong> raised
                    </p>
                    <p style={{ marginBottom: '1rem', color: '#718096' }}>
                        Target: ₹{target.toLocaleString()}
                    </p>
                    <div className="card-progress">
                        <div
                            className="card-progress-bar"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        ></div>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                        by {creatorId}
                    </p>
                </div>
            </div>
        </Link>
    );
}

const getCategoryColor = (category) => {
    const colors = {
        'Medical': '#e53e3e',
        'Education': '#3182ce',
        'Personal': '#805ad5',
        'Community': '#38a169'
    };
    return colors[category] || '#718096';
};

const Feature = ({ title, text, icon }) => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1rem',
                background: '#e2e8f0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
            }}>
                {icon}
            </div>
            <h3 style={{ marginBottom: '1rem', color: '#2d3748' }}>{title}</h3>
            <p style={{ color: '#718096' }}>{text}</p>
        </div>
    );
};

export default function Home() {
    const [campaignList, setCampaignList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        // Sample campaign data - replace with API call in production
        const sampleCampaigns = [
            // Medical Campaign
            {
                id: 1,
                balance: 25000,
                target: 500000,
                creatorId: "Rahul Sharma",
                name: "Help My Father's Heart Surgery",
                description: "My father needs an urgent heart surgery. We've exhausted all our savings and need your support to save his life. Every contribution matters.",
                imageURL: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
                category: "Medical"
            },
            // Education Campaign
            {
                id: 2,
                balance: 15000,
                target: 200000,
                creatorId: "Priya Patel",
                name: "My Daughter's Education Fund",
                description: "My daughter got admission to a prestigious engineering college but we can't afford the fees. Please help her achieve her dreams.",
                imageURL: "https://images.unsplash.com/photo-1523240794102-9ebd83b17d8e?w=400&h=300&fit=crop",
                category: "Education"
            },
            // Personal Campaign
            {
                id: 3,
                balance: 12000,
                target: 80000,
                creatorId: "Meera Singh",
                name: "Start My Small Business",
                description: "I want to start a small tailoring business to support my family. I have the skills but need funds for equipment and initial setup.",
                imageURL: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
                category: "Personal"
            },
            // Community Campaign
            {
                id: 4,
                balance: 30000,
                target: 80000,
                creatorId: "Local Youth Group",
                name: "Community Library for Our Village",
                description: "We want to build a small library in our village so children can study and access books. This will help improve education in our area.",
                imageURL: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
                category: "Community"
            },
            {
                id: 5,
                balance: 80000,
                target: 300000,
                creatorId: "Amit Kumar",
                name: "Cancer Treatment for My Wife",
                description: "My wife has been diagnosed with breast cancer. The treatment is expensive and we need your help to fight this battle together.",
                imageURL: "https://plus.unsplash.com/premium_photo-1708371357652-6ca7bc1d635b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                category: "Medical"
            },
            {
                id: 6,
                balance: 5000,
                target: 100000,
                creatorId: "Sneha Reddy",
                name: "Study Abroad Dream",
                description: "I got accepted to study computer science in the USA but need help with tuition fees. This is my chance to change my family's future.",
                imageURL: "https://plus.unsplash.com/premium_photo-1663079426406-1b82fed16a79?q=80&w=1215&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                category: "Education"
            }
        ];

        setCampaignList(sampleCampaigns);
    }, []);

    const categories = ['All', 'Medical', 'Education', 'Personal', 'Community'];

    const filteredCampaigns = selectedCategory === 'All'
        ? campaignList
        : campaignList.filter(campaign => campaign.category === selectedCategory);

    return (
        <div>
            <div className="container">
                <h1 style={{
                    fontSize: '3rem',
                    marginBottom: '2rem',
                    color: '#2d3748'
                }}>
                    Crowdfunding for Social Welfare <br />
                    Transparent & Secure 😄
                </h1>
                <Link to="/campaign/new" className="btn">
                    Create Campaign
                </Link>
            </div>

            <div className="container">
                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    color: '#2d3748'
                }}>
                    Open Campaigns
                </h2>

                {/* Category Filter */}
                <div style={{
                    marginBottom: '2rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '2rem',
                                background: selectedCategory === category ? getCategoryColor(category) : '#e2e8f0',
                                color: selectedCategory === category ? 'white' : '#4a5568',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {filteredCampaigns.length > 0 ? (
                    <div className="grid">
                        {filteredCampaigns.map((el, i) => (
                            <CampaignCard
                                key={i}
                                name={el.name}
                                description={el.description}
                                creatorId={el.creatorId}
                                imageURL={el.imageURL}
                                id={i}
                                target={el.target}
                                balance={el.balance}
                                category={el.category}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid">
                        <div className="card">
                            <div className="card-content">
                                <h3>No campaigns in this category</h3>
                                <p>Try selecting a different category or be the first to create a campaign in this category!</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="container" id="howitworks">
                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '2rem',
                    color: '#2d3748'
                }}>
                    How BetterFund Works
                </h2>
                <div className="grid">
                    <Feature
                        icon="📢"
                        title="Create a Campaign for Fundraising"
                        text="It'll take only 2 minutes. Just enter a few details about the funds you are raising for."
                    />
                    <Feature
                        icon="📤"
                        title="Share your Campaign"
                        text="All you need to do is share the Campaign with your friends, family and others. In no time, support will start pouring in."
                    />
                    <Feature
                        icon="💰"
                        title="Request and Withdraw Funds"
                        text="The funds raised can be withdrawn directly to the recipient when approved by the campaign creator and platform admins."
                    />
                </div>
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>
                        For any queries raise an issue on{' '}
                        <Link
                            to="/report-issues"
                            className="cta-button"
                        >
                            Report Issues
                        </Link>
                    </h3>
                </div>
            </div>
        </div>
    );
} 