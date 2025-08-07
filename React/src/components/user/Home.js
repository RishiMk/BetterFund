import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Campaign card component
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

// Success story card component
function SuccessStoryCard({ title, description, imageURL, author }) {
  return (
    <div className="card">
      <img
        src={imageURL}
        alt="success story"
        style={{
          width: '100%',
          height: 'auto',
          borderTopLeftRadius: '0.5rem',
          borderTopRightRadius: '0.5rem',
        }}
      />
      <div className="card-content">
        <p style={{
          fontWeight: 'bold',
          fontSize: '1.1rem',
          marginBottom: '0.5rem',
          color: '#2d3748'
        }}>
          {title} {/* Shows: Raised ₹X */}
        </p>

        <p className="card-description" style={{ marginBottom: '1rem' }}>
          {description} {/* Shows: updates */}
        </p>

        <p style={{ fontSize: '0.875rem', color: '#718096' }}>
        </p>
      </div>
    </div>
  );
}


// Category color mapping
const getCategoryColor = (category) => {
  const colors = {
    'Medical': '#e53e3e',
    'Education': '#3182ce',
    'Personal': '#805ad5',
    'Community': '#38a169',
    'Natural Disaster': '#d69e2e',
  };
  return colors[category] || '#718096';
};

// How it works card component
const Feature = ({ title, text, icon }) => (
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

export default function Home() {
  const [campaignList, setCampaignList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [successStories, setSuccessStories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/campaign/active")
      .then(res => res.json())
      .then(data => {
        let formatted = [];
        if (Array.isArray(data) && data.length > 0) {
          formatted = data.map(c => {
            const categoryName = c.category?.cname || 'Uncategorized';
            return {
              id: c.campaignId,
              name: c.title,
              description: "Help support this cause with your contribution.",
              creatorId: c.user?.username || 'Unknown',
              imageURL: '/placeholder.jpg',
              target: c.targetAmt || 0,
              balance: c.wallet?.amount || 0,
              category: categoryName
            };
          });
        }
        setCampaignList(formatted);
      })
      .catch(err => {
        console.error("Error fetching campaigns:", err);
        setCampaignList([]);
      });
  }, []);

  useEffect(() => {
  fetch("http://localhost:5245/api/successstories")
    .then(res => res.json())
    .then(data => {
      console.log("Fetched success stories:", data);

      const formatted = data.map(story => ({
        id: story.successId,
        title: `Raised ₹${story.fundRaised?.toLocaleString() || 0}`,
        description: story.updates,
        imageURL: `http://localhost:5245/api/successstories/image/${story.successId}`,
        author: "BetterFund"
      }));
      setSuccessStories(formatted);
    })
    .catch(err => {
      console.error("Error fetching success stories:", err);
      setSuccessStories([]);
    });
}, []);



  const categories = ['All', ...new Set(campaignList.map(c => c.category))];

  const filteredCampaigns = selectedCategory === 'All'
    ? campaignList
    : campaignList.filter(campaign =>
        campaign.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

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
              <CampaignCard key={i} {...el} />
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

      {/* Success Stories Section */}
      <div className="container" style={{ marginTop: '4rem' }}>
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: '#2d3748'
        }}>
          Success Stories
        </h2>

        {successStories.length > 0 ? (
          <div className="grid">
            {successStories.map((story, index) => (
              <SuccessStoryCard key={index} {...story} />
            ))}
          </div>
        ) : (
          <p style={{ color: '#718096' }}>No success stories found.</p>
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
                    For any queries or suggestions:{' '}
                    
                    |{' '}
                    <Link to="/feedback" className="cta-button">Give Feedback</Link>
                  </h3>
                </div>
      </div>
    </div>
  );
}
