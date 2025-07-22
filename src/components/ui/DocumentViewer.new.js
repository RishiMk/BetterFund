import React, { useState } from 'react';

export default function DocumentViewer({ documents, onClose, onApprove, onReject, campaignName }) {
    const [currentDocIndex, setCurrentDocIndex] = useState(0);
    const [verificationNotes, setVerificationNotes] = useState('');

    const handleNext = () => {
        if (currentDocIndex < documents.length - 1) {
            setCurrentDocIndex(currentDocIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentDocIndex > 0) {
            setCurrentDocIndex(currentDocIndex - 1);
        }
    };

    const handleApprove = () => {
        onApprove(verificationNotes);
    };

    const handleReject = () => {
        onReject(verificationNotes);
    };

    const getDocumentType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf':
                return 'PDF Document';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'Image';
            case 'doc':
            case 'docx':
                return 'Word Document';
            case 'xls':
            case 'xlsx':
                return 'Excel Document';
            default:
                return 'Document';
        }
    };

    const getDocumentIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf':
                return '📄';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return '🖼️';
            case 'doc':
            case 'docx':
                return '📝';
            case 'xls':
            case 'xlsx':
                return '📊';
            default:
                return '📎';
        }
    };

    const currentDocument = documents[currentDocIndex];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                maxWidth: '95vw',
                maxHeight: '95vh',
                width: '1200px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Document Verification</h2>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
                            {campaignName}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.5rem'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Main Content Area */}
                <div style={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden'
                }}>
                    {/* Left Sidebar - Document List */}
                    <div style={{
                        width: '300px',
                        borderRight: '1px solid #e2e8f0',
                        background: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            padding: '1.25rem',
                            borderBottom: '1px solid #e2e8f0',
                            background: '#f8fafc'
                        }}>
                            <h4 style={{
                                margin: '0',
                                color: '#2d3748',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}>
                                Documents ({documents.length})
                            </h4>
                        </div>
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            {documents.map((doc, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentDocIndex(index)}
                                    style={{
                                        padding: '1rem',
                                        border: index === currentDocIndex ? '2px solid #2c7a7b' : '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        background: index === currentDocIndex ? '#e6fffa' : 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        boxShadow: index === currentDocIndex ? '0 2px 4px rgba(44, 122, 123, 0.1)' : 'none',
                                        width: '100%',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>{getDocumentIcon(doc)}</span>
                                    <div>
                                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{doc}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>{getDocumentType(doc)}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Document Viewer */}
                    <div style={{
                        flex: 1,
                        background: '#f8f9fa',
                        padding: '2rem',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '3rem 2rem',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                {getDocumentIcon(currentDocument)}
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{currentDocument}</h3>
                            <p style={{ margin: 0, color: '#718096' }}>
                                {getDocumentType(currentDocument)}
                            </p>
                            <div style={{ marginTop: '1rem' }}>
                                <button className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>
                                    📥 Download
                                </button>
                                <button className="btn">
                                    👁️ View Full Document
                                </button>
                            </div>
                            <div style={{
                                marginTop: '2rem',
                                padding: '1rem',
                                background: '#fff3cd',
                                borderRadius: '4px',
                                border: '1px solid #ffeaa7',
                                maxWidth: '400px'
                            }}>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
                                    <strong>Note:</strong> In a real application, this would display the actual document content.
                                    For demo purposes, we're showing a placeholder.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Notes */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid #e2e8f0',
                    background: '#ffffff'
                }}>
                    <label className="form-label" style={{ color: '#2d3748', fontSize: '0.95rem', marginBottom: '0.75rem', display: 'block' }}>
                        Verification Notes (Optional):
                    </label>
                    <textarea
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        className="form-textarea"
                        placeholder="Add any notes about document verification..."
                        rows="3"
                        style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '1rem',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            minHeight: '100px',
                            width: '100%',
                            transition: 'border-color 0.2s ease'
                        }}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'flex-end'
                }}>
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={handleReject} className="btn btn-secondary">
                        Reject Campaign
                    </button>
                    <button onClick={handleApprove} className="btn">
                        Approve Campaign
                    </button>
                </div>
            </div>
        </div>
    );
}
