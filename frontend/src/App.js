import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css';

function App() {

  const [view, setView] = useState('create');
  const [vanishId, setVanishId] = useState('');

  useEffect(() => {
    const path = window.location.pathname;

    if (path !== '/') {
      const id = path.substring(1);
      setVanishId(id);
      setView('view');
      fetchVanish(id);
    }
  }, []);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expiryTime, setExpiryTime] = useState('1h');
  const [createdUrl, setCreatedUrl] = useState('');

  const [vanishData, setVanishData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/vanish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          expiryTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const vanishId = data.url;
        const userFriendlyUrl = `${window.location.origin}/${vanishId}`;
        setCreatedUrl(userFriendlyUrl);

        setTitle('');
        setContent('');
        setExpiryTime('1h');
      } else {
        setError('Failed to create the Vanish.');
      }
    } 
    catch (err) {
      setError('An error occurred. Is the backend server running?');
    } 
    finally {
      setLoading(false);
    }
  };

  const fetchVanish = async (id) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/vanish/${id}`);
      if (response.ok) {
        const data = await response.json();
        setVanishData(data);
      } else if (response.status === 404) {
        setError('Vanish not found. It may have expired.');
      } else {
        setError('Failed to fetch the Vanish.');
      }
    } catch (err) {
      setError('An error occurred while fetching the Vanish.');
    } finally {
      setLoading(false);
    }
  };

  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdUrl);
    alert('URL copied to clipboard!');
  };

  if (view === 'create') {
    return (
      <div className="app-container">
        <h1>VanishInk</h1>
        <p>Create a shareable link for your text or code that vanishes after a set time.</p>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="title">Title (Optional)</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text or code here..."
              required
              rows="10"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryTime">Expires After</label>
            <select
              id="expiryTime"
              value={expiryTime}
              onChange={(e) => setExpiryTime(e.target.value)}
            >
              <option value="1h">1 Hour</option>
              <option value="1d">1 Day</option>
              <option value="1w">1 Week</option>
              <option value="never">Never</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Vanish'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {createdUrl && (
          <div className="result-container">
            <p>Your Vanish has been created!</p>
            <div className="url-container">
              <input type="text" value={createdUrl} readOnly />
              <button onClick={copyToClipboard}>Copy URL</button>
            </div>
            <p>Share this URL with anyone. They will be able to view it until it expires.</p>
          </div>
        )}
      </div>
    );
  }

  // RENDER THE VIEW VIEW
  if (view === 'view') {
    return (
      <div className="app-container">
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}

        {vanishData && (
          <div className="vanish-container">
            <h1>{vanishData.title || 'Untitled Vanish'}</h1>
            <p>Created on: {new Date(vanishData.createdAt).toLocaleString()}</p>
            {vanishData.expiresAt && (
              <p>Expires on: {new Date(vanishData.expiresAt).toLocaleString()}</p>
            )}
            <div className="content-display">
              <SyntaxHighlighter language="java" style={dark}>
                {vanishData.content}
              </SyntaxHighlighter>
            </div>
            
          </div>
        )}
      </div>
    );
  }
}

export default App;