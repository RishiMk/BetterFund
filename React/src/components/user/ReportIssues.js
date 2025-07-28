import React, { useState } from 'react';

export default function ReportIssues() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'bug',
        email: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Issue submitted:', formData);
        alert('Issue submitted successfully! We will review it shortly.');
        setFormData({
            title: '',
            description: '',
            category: 'bug',
            email: ''
        });
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Report an Issue</h1>
                <p>Help us improve BetterFund by reporting bugs, suggesting features, or letting us know about any problems you encounter.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Issue Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Brief description of the issue"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category" className="form-label">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="form-input"
                            required
                        >
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="improvement">Improvement Suggestion</option>
                            <option value="security">Security Issue</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Detailed Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Please provide a detailed description of the issue."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="your.email@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <button type="submit" className="btn">
                            Submit Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 