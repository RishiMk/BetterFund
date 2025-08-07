import React, { useState, useEffect, useCallback } from 'react';

export default function CampaignComments({ campaignId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  // const userName = localStorage.getItem('userName') || 'Anonymous';


  // Fetch comments from backend
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/comments?campaignId=${campaignId}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  // Post new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          userId,
          text: newComment,
        }),
      });

      if (!res.ok) throw new Error('Failed to post comment');

      setNewComment('');
      await fetchComments(); // Reload comments after posting
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  // Load comments on component mount or campaignId change
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // JSX
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Comments</h3>

      {/* Comment input form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          placeholder="Write your comment..."
          style={{ width: '100%', padding: '10px', resize: 'none' }}
        />
        <button type="submit" className="btn-login">
          Post Comment
        </button>
      </form>

      {/* Comments list */}
      {loading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((c) => (
          <div
            key={c.commentId}
            style={{
              marginBottom: '1rem',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            <strong>{c.userName || `User #${c.userId}`}</strong>
            <p>{c.text}</p>
          </div>
        ))
      )}
    </div>
  );
}
