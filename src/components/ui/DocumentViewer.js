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

    const getDocumentIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'pdf': return '📄';
            case 'jpg':
            case 'jpeg':
            case 'png': return '🖼️';
            case 'doc':
            case 'docx': return '📝';
            case 'xls':
            case 'xlsx': return '📊';
            case 'txt': return '📃';
            default: return '📎';
        }
    };

    const renderDocumentContent = (doc) => {
        const ext = doc.name.split('.').pop().toLowerCase();
        const base64 = doc.content;

        if (!base64) {
            return <p style={{ color: '#999' }}>No preview available. Document might not be uploaded correctly.</p>;
        }

        if (['jpg', 'jpeg', 'png'].includes(ext)) {
            return <img src={`data:image/${ext};base64,${base64}`} alt={doc.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />;
        }

        if (ext === 'pdf') {
            return (
                <iframe
                    src={`data:application/pdf;base64,${base64}`}
                    title={doc.name}
                    width="100%"
                    height="500px"
                />
            );
        }

        if (ext === 'txt') {
            let decoded = "";
            try {
                decoded = atob(base64);
            } catch (e) {
                decoded = "(Could not decode file)";
            }
            return (
                <pre style={{
                    textAlign: 'left',
                    background: '#f1f5f9',
                    padding: '1rem',
                    borderRadius: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap'
                }}>{decoded}</pre>
            );
        }

        return <p style={{ color: '#666' }}>Unsupported preview. You may download the document to view.</p>;
    };

    const currentDoc = documents[currentDocIndex];

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '90vw',
                height: '90vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)'
            }}>
                {/* Header */}
                <div style={{ padding: '1rem', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: 0 }}>📁 Document Verification</h3>
                        <p style={{ margin: 0, color: '#666' }}>{campaignName}</p>
                    </div>
                    <button onClick={onClose} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>✖</button>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem' }}>
                    <button onClick={handlePrevious} disabled={currentDocIndex === 0} className="btn btn-secondary">← Previous</button>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Document {currentDocIndex + 1} of {documents.length}
                    </div>
                    <button onClick={handleNext} disabled={currentDocIndex === documents.length - 1} className="btn btn-secondary">Next →</button>
                </div>

                {/* File Tabs */}
                <div style={{ display: 'flex', overflowX: 'auto', padding: '0.5rem 1rem', gap: '0.5rem' }}>
                    {documents.map((doc, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentDocIndex(idx)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: idx === currentDocIndex ? '2px solid #2c7a7b' : '1px solid #ccc',
                                background: idx === currentDocIndex ? '#e6fffa' : '#fff',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {getDocumentIcon(doc.name)} {doc.name}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
                    <div style={{
                        background: '#fff',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        minHeight: '400px',
                        textAlign: 'center'
                    }}>
                        {renderDocumentContent(currentDoc)}
                    </div>
                </div>

                {/* Verification Notes */}
                <div style={{ padding: '1rem', borderTop: '1px solid #ddd' }}>
                    <label>Verification Notes:</label>
                    <textarea
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        rows="3"
                        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
                        placeholder="Add notes regarding verification..."
                    />
                </div>

                {/* Action Buttons */}
                <div style={{ padding: '1rem', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={handleReject} className="btn btn-secondary">Reject Campaign</button>
                    <button onClick={handleApprove} className="btn">Approve Campaign</button>
                </div>
            </div>
        </div>
    );
}
