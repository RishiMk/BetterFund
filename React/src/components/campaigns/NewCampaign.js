import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewCampaign() {
    const navigate = useNavigate();
    const [formInput, setFormInput] = useState({
        name: '',
        description: '',
        target: '',
        category: 'Community',
        startDate: '',
        endDate: ''
    });
    const [documentFile, setDocumentFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['Medical', 'Education', 'Community'];

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

        const categoryMap = {
            Medical: 1,
            Community: 2,
            Education: 3
        };

        try {
            const userId = localStorage.getItem("userId");

            const formData = new FormData();
            formData.append("userId", userId);
            formData.append("title", formInput.name);
            formData.append("description", formInput.description); // ✅ added
            formData.append("categoryId", categoryMap[formInput.category]);
            formData.append("startDate", formInput.startDate);
            formData.append("endDate", formInput.endDate);
            formData.append("targetAmt", formInput.target);
            formData.append("documentFile", documentFile);

            const response = await fetch("http://localhost:8080/api/campaign/create", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Server Error");

            alert("Campaign created successfully!");
            navigate('/');
        } catch (error) {
            console.error("Error creating campaign:", error);
            alert("Failed to create campaign. Please try again.");
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

                    {/* ✅ Description Field */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={formInput.description}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter campaign description"
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
                        <label className="form-label">Target Amount (₹)</label>
                        <input
                            type="number"
                            min={0}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
                                const isNumber = /^\d$/.test(e.key);
                                if (!isNumber && !allowedKeys.includes(e.key)) e.preventDefault();
                            }}
                            name="target"
                            value={formInput.target}
                            onChange={handleInput}
                            className="form-input"
                            placeholder="Enter target amount"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formInput.startDate}
                            onChange={handleInput}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={formInput.endDate}
                            onChange={handleInput}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                       <label className="form-label">
    Upload Supporting Document <span style={{ color: 'gray', fontSize: '0.9em' }}>(PDF only)</span>
</label>

                       <input
    type="file"
    name="documentFile"
    accept=".pdf,application/pdf"
    onChange={(e) => setDocumentFile(e.target.files[0])}
    className="form-input"
    required
/>

                    </div>

                    <button
                        type="submit"
                        className="btn-login"
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
