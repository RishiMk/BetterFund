import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewCampaign() {
    const navigate = useNavigate();
    const [formInput, setFormInput] = useState({
        name: '',
        description: '',
        target: '',
        imageURL: '',
        category: 'Community'
    });
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        'Medical',
        'Education',
        'Personal',
        'Community'
    ];

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: Replace with API call to create campaign
            console.log('Creating campaign:', formInput);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert('Campaign created successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Failed to create campaign. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    Create a Campaign
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Campaign Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formInput.name}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter campaign name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            name="category"
                            value={formInput.category}
                            onChange={handleInput}
                            className="form-input"
                            required
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formInput.description}
                            onChange={handleInput}
                            className="form-textarea"
                            placeholder="Enter campaign description"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Target Amount (₹)</label>
                        <input
                            type="number"
                            name="target"
                            value={formInput.target}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter target amount"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input
                            type="url"
                            name="imageURL"
                            value={formInput.imageURL}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter image URL"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating...' : 'Create Campaign'}
                    </button>
                </form>
            </div>
        </div>
    );
} 