import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DocumentViewer from '../ui/DocumentViewer';
import axios from 'axios';

export default function AdminDashboard() {
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
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        fetchPendingCampaigns();
    }, [navigate]);

    const fetchPendingCampaigns = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("⚠️ No JWT token found. Aborting.");
            return;
        }

        axios.get('http://localhost:8081/api/campaign/admin/pending-campaigns', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                const campaignsArray = Array.isArray(res.data) ? res.data : [];
                setPendingCampaigns(campaignsArray);
                setStats(prev => ({
                    ...prev,
                    totalCampaigns: campaignsArray.length,
                    pendingApprovals: campaignsArray.length
                }));
            })
            .catch(err => {
                console.error("❌ Error fetching pending campaigns:", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    alert("Session expired or unauthorized. Please log in again.");
                    localStorage.clear();
                    navigate('/login');
                }
            });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleViewDocuments = (campaign) => {
        const rawDocs = campaign.document?.documents;
        let parsedDocs = [];

        if (Array.isArray(rawDocs)) {
            parsedDocs = rawDocs.map(name => ({ name, content: null }));
        } else if (rawDocs && typeof rawDocs === 'object') {
            parsedDocs = Object.entries(rawDocs).map(([name, content]) => ({ name, content }));
        } else if (typeof rawDocs === 'string') {
            parsedDocs = [{ name: 'document.txt', content: rawDocs }];
        }

        setSelectedCampaign({ ...campaign, parsedDocuments: parsedDocs });
        setShowDocumentViewer(true);
    };

    const handleCloseDocumentViewer = () => {
        setShowDocumentViewer(false);
        setSelectedCampaign(null);
    };

    const handleApproveCampaign = (verificationNotes) => {
        const token = localStorage.getItem('token');
        if (!token || !selectedCampaign) return;

        axios.put(`http://localhost:8081/api/admin/campaigns/${selectedCampaign.campaignId}/approve`,
            { notes: verificationNotes },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                alert(`✅ Campaign "${selectedCampaign.title}" approved.`);
                setPendingCampaigns(prev => prev.filter(c => c.campaignId !== selectedCampaign.campaignId));
                handleCloseDocumentViewer();
            })
            .catch(err => {
                console.error("❌ Approval error:", err.response?.data || err.message);
                alert("Failed to approve campaign.");
            });
    };

    const handleRejectCampaign = (verificationNotes) => {
        const token = localStorage.getItem('token');
        if (!token || !selectedCampaign) return;

        axios.put(`http://localhost:8081/api/admin/campaigns/${selectedCampaign.campaignId}/reject`,
            { notes: verificationNotes },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                alert(`❌ Campaign "${selectedCampaign.title}" rejected.`);
                setPendingCampaigns(prev => prev.filter(c => c.campaignId !== selectedCampaign.campaignId));
                handleCloseDocumentViewer();
            })
            .catch(err => {
                console.error("❌ Rejection error:", err.response?.data || err.message);
                alert("Failed to reject campaign.");
            });
    };

    return (
        <div className="container">
            {/* Top Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div>
                    <Link to="/" className="btn btn-secondary" style={{ marginRight: '1rem' }}>View Site</Link>
                    <button onClick={handleLogout} className="btn">Logout</button>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card"><div className="card-content"><h3>Total Campaigns</h3><p>{stats.totalCampaigns}</p></div></div>
                <div className="card"><div className="card-content"><h3>Active Campaigns</h3><p>{stats.activeCampaigns}</p></div></div>
                <div className="card"><div className="card-content"><h3>Total Raised</h3><p>₹{stats.totalRaised.toLocaleString()}</p></div></div>
                <div className="card"><div className="card-content"><h3>Pending Approvals</h3><p>{stats.pendingApprovals}</p></div></div>
            </div>

            {/* Pending Campaign List */}
            <div style={{ marginBottom: '2rem' }}>
                <h2>Pending Campaign Approvals</h2>
                {pendingCampaigns.length > 0 ? (
                    <div className="grid">
                        {pendingCampaigns.map(c => (
                            <div key={c.campaignId} className="card">
                                <div className="card-content">
                                    <h3>{c.title}</h3>
                                    <p><strong>Creator:</strong> {c.user?.fullName || c.user?.email}</p>
                                    <p><strong>Target:</strong> ₹{c.targetAmt}</p>
                                    <p><strong>Start:</strong> {c.startDate}</p>
                                    <p><strong>End:</strong> {c.endDate}</p>
                                    <p><strong>Status:</strong> {c.status}</p>

                                    <div style={{ marginTop: '1rem' }}>
                                        <button onClick={() => handleViewDocuments(c)} className="btn">📄 View Documents</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No pending campaign approvals.</p>
                )}
            </div>

            {/* Document Modal */}
            {showDocumentViewer && selectedCampaign && (
                <DocumentViewer
                    documents={selectedCampaign.parsedDocuments || []}
                    campaignName={selectedCampaign.title}
                    onClose={handleCloseDocumentViewer}
                    onApprove={handleApproveCampaign}
                    onReject={handleRejectCampaign}
                />
            )}
        </div>
    );
}
