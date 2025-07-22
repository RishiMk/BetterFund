import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DocumentViewer from '../ui/DocumentViewer';

export default function AdminDashboard() {
    const [campaigns, setCampaigns] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingCampaigns, setPendingCampaigns] = useState([]);
    const [stats, setStats] = useState({
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalRaised: 0,
        pendingApprovals: 0
    });
    const [showDocumentViewer, setShowDocumentViewer] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin is logged in
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // Load sample data
        loadDashboardData();
    }, [navigate]);

    const loadDashboardData = () => {
        // Sample campaigns data
        const sampleCampaigns = [
            {
                id: 1,
                name: "Help Build a Community Library",
                creatorId: "Sarah Johnson",
                status: "active",
                balance: 45000,
                target: 100000,
                requestsCount: 2,
                approversCount: 45,
                createdAt: "2024-01-15"
            },
            {
                id: 2,
                name: "Medical Equipment for Rural Clinic",
                creatorId: "Dr. Michael Chen",
                status: "active",
                balance: 125000,
                target: 200000,
                requestsCount: 1,
                approversCount: 89,
                createdAt: "2024-01-10"
            },
            {
                id: 3,
                name: "Clean Water Project",
                creatorId: "Emma Rodriguez",
                status: "active",
                balance: 75000,
                target: 150000,
                requestsCount: 3,
                approversCount: 67,
                createdAt: "2024-01-20"
            }
        ];

        // Sample pending campaigns with more detailed document information
        const samplePendingCampaigns = [
            {
                id: 7,
                name: "Animal Shelter Renovation",
                creatorId: "Maria Garcia",
                target: 75000,
                documents: [
                    "business_plan.pdf",
                    "identity_proof.pdf",
                    "bank_statement.pdf",
                    "property_ownership.pdf",
                    "construction_quotes.pdf"
                ],
                submittedAt: "2024-01-25",
                description: "Renovating a local animal shelter to provide better facilities for abandoned animals."
            },
            {
                id: 8,
                name: "Educational Scholarship Fund",
                creatorId: "Robert Kim",
                target: 120000,
                documents: [
                    "scholarship_proposal.pdf",
                    "identity_proof.pdf",
                    "academic_credentials.pdf",
                    "financial_plan.pdf"
                ],
                submittedAt: "2024-01-26",
                description: "Providing scholarships to underprivileged students for higher education."
            },
            {
                id: 9,
                name: "Community Health Center",
                creatorId: "Dr. Lisa Patel",
                target: 200000,
                documents: [
                    "medical_license.pdf",
                    "facility_plan.pdf",
                    "equipment_list.pdf",
                    "staffing_plan.pdf",
                    "financial_projections.pdf"
                ],
                submittedAt: "2024-01-27",
                description: "Establishing a community health center to provide affordable healthcare services."
            }
        ];

        // Sample pending requests
        const samplePendingRequests = [
            {
                id: 1,
                campaignId: 1,
                campaignName: "Help Build a Community Library",
                description: "Purchase books and furniture for the library",
                amount: 15000,
                recipient: "Sarah Johnson",
                submittedAt: "2024-01-24"
            },
            {
                id: 2,
                campaignId: 3,
                campaignName: "Clean Water Project",
                description: "Buy water purification equipment",
                amount: 25000,
                recipient: "Emma Rodriguez",
                submittedAt: "2024-01-23"
            }
        ];

        setCampaigns(sampleCampaigns);
        setPendingCampaigns(samplePendingCampaigns);
        setPendingRequests(samplePendingRequests);

        // Calculate stats
        const totalRaised = sampleCampaigns.reduce((sum, campaign) => sum + campaign.balance, 0);
        setStats({
            totalCampaigns: sampleCampaigns.length + samplePendingCampaigns.length,
            activeCampaigns: sampleCampaigns.length,
            totalRaised: totalRaised,
            pendingApprovals: samplePendingCampaigns.length + samplePendingRequests.length
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('userType');
        navigate('/login');
    };

    const handleViewDocuments = (campaign) => {
        setSelectedCampaign(campaign);
        setShowDocumentViewer(true);
    };

    const handleCloseDocumentViewer = () => {
        setShowDocumentViewer(false);
        setSelectedCampaign(null);
    };

    const handleApproveCampaign = (verificationNotes) => {
        // TODO: Implement campaign approval logic with notes
        alert(`Campaign "${selectedCampaign.name}" approved!${verificationNotes ? ` Notes: ${verificationNotes}` : ''}`);
        setPendingCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
        handleCloseDocumentViewer();
    };

    const handleRejectCampaign = (verificationNotes) => {
        // TODO: Implement campaign rejection logic with notes
        alert(`Campaign "${selectedCampaign.name}" rejected!${verificationNotes ? ` Notes: ${verificationNotes}` : ''}`);
        setPendingCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id));
        handleCloseDocumentViewer();
    };

    const handleApproveRequest = (requestId) => {
        // TODO: Implement request approval logic
        alert(`Request ${requestId} approved!`);
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const handleRejectRequest = (requestId) => {
        // TODO: Implement request rejection logic
        alert(`Request ${requestId} rejected!`);
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div>
                    <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>
                        View Site
                    </Link>
                    <button onClick={handleLogout} className="btn">
                        Logout
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div className="card-content">
                        <h3>Total Campaigns</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                            {stats.totalCampaigns}
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <h3>Active Campaigns</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                            {stats.activeCampaigns}
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <h3>Total Raised</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                            ₹{stats.totalRaised.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="card">
                    <div className="card-content">
                        <h3>Pending Approvals</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c7a7b' }}>
                            {stats.pendingApprovals}
                        </p>
                    </div>
                </div>
            </div>

            {/* Pending Campaign Approvals */}
            <div style={{ marginBottom: '2rem' }}>
                <h2>Pending Campaign Approvals</h2>
                {pendingCampaigns.length > 0 ? (
                    <div className="grid">
                        {pendingCampaigns.map(campaign => (
                            <div key={campaign.id} className="card">
                                <div className="card-content">
                                    <h3>{campaign.name}</h3>
                                    <p><strong>Creator:</strong> {campaign.creatorId}</p>
                                    <p><strong>Target:</strong> ₹{campaign.target.toLocaleString()}</p>
                                    <p><strong>Submitted:</strong> {campaign.submittedAt}</p>
                                    <p><strong>Description:</strong> {campaign.description}</p>
                                    <p><strong>Documents ({campaign.documents.length}):</strong></p>
                                    <div className="document-list">
                                        <ul>
                                            {campaign.documents.map((doc, index) => (
                                                <li key={index}>{doc}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleViewDocuments(campaign)}
                                            className="btn"
                                        >
                                            📄 Review Documents
                                        </button>
                                        <button
                                            onClick={() => handleApproveCampaign()}
                                            className="btn"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectCampaign()}
                                            className="btn btn-secondary"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No pending campaign approvals.</p>
                )}
            </div>

            {/* Pending Request Approvals */}
            <div style={{ marginBottom: '2rem' }}>
                <h2>Pending Request Approvals</h2>
                {pendingRequests.length > 0 ? (
                    <div className="grid">
                        {pendingRequests.map(request => (
                            <div key={request.id} className="card">
                                <div className="card-content">
                                    <h3>{request.campaignName}</h3>
                                    <p><strong>Request:</strong> {request.description}</p>
                                    <p><strong>Amount:</strong> ₹{request.amount.toLocaleString()}</p>
                                    <p><strong>Recipient:</strong> {request.recipient}</p>
                                    <p><strong>Submitted:</strong> {request.submittedAt}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <button
                                            onClick={() => handleApproveRequest(request.id)}
                                            className="btn"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejectRequest(request.id)}
                                            className="btn btn-secondary"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No pending request approvals.</p>
                )}
            </div>

            {/* Active Campaigns */}
            <div>
                <h2>Active Campaigns</h2>
                <div className="grid">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="card">
                            <div className="card-content">
                                <h3>{campaign.name}</h3>
                                <p><strong>Creator:</strong> {campaign.creatorId}</p>
                                <p><strong>Raised:</strong> ₹{campaign.balance.toLocaleString()} / ₹{campaign.target.toLocaleString()}</p>
                                <p><strong>Contributors:</strong> {campaign.approversCount}</p>
                                <p><strong>Requests:</strong> {campaign.requestsCount}</p>
                                <Link to={`/campaign/${campaign.id}`} className="btn">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Document Viewer Modal */}
            {showDocumentViewer && selectedCampaign && (
                <DocumentViewer
                    documents={selectedCampaign.documents}
                    campaignName={selectedCampaign.name}
                    onClose={handleCloseDocumentViewer}
                    onApprove={handleApproveCampaign}
                    onReject={handleRejectCampaign}
                />
            )}
        </div>
    );
} 