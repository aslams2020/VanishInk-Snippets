import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaGithub, FaEnvelope, FaUser, FaCopy, FaClock, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import './App.css';

function App() {
  const [view, setView] = useState('create');
  const [vanishId, setVanishId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [expiryTime, setExpiryTime] = useState('1h');
  const [createdUrl, setCreatedUrl] = useState('');
  const [vanishData, setVanishData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const path = window.location.pathname;
    if (path !== '/') {
      const id = path.substring(1);
      setVanishId(id);
      setView('view');
      fetchVanish(id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/vanish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, expiryTime }),
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
    } catch (err) {
      setError('An error occurred. Is the backend server running?');
    } finally {
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

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>VanishInk</h2>
        </div>
        <div className="nav-links">
          <a href="https://github.com/aslams2020/VanishInk-Snippets" target="_blank" rel="noopener noreferrer">
            <FaGithub className="nav-icon" />
          </a>
          <a href="mailto:sayyadaslam2020@gmail.com">
            <FaEnvelope className="nav-icon" />
          </a>
          <a href="/about" className="nav-span">
            About
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        {view === 'create' ? (
          <div className="create-container">
            <div className="hero-section">
              <h1>Share Code. Vanish Forever.</h1>
              <p>Create secure, temporary links for your code snippets that automatically disappear.</p>
            </div>
            <form onSubmit={handleSubmit} className="create-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                  id="content"
                  className="form-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your code or text here..."
                  required
                  rows="8"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryTime" className="form-label">Expiry Time</label>
                  <select
                    id="expiryTime"
                    className="form-select"
                    value={expiryTime}
                    onChange={(e) => setExpiryTime(e.target.value)}
                  >
                    <option value="1h">1 Hour</option>
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <button type="submit" className="create-btn" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Vanish Link'}
                </button>
              </div>
            </form>


            {error && <div className="error-message">{error}</div>}

            {createdUrl && (
              <div className="result-container">
                <h3>Your Vanish Link is Ready!</h3>
                <div className="url-box">
                  <input type="text" value={createdUrl} readOnly className="url-input" />
                  <button onClick={copyToClipboard} className="copy-btn">
                    <FaCopy /> Copy
                  </button>
                </div>
                <p className="url-note">Share this link. It will expire based on your chosen duration.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="view-container">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            {vanishData && (
              <div className="vanish-card">
                <div className="card-header">
                  <h1>{vanishData.title || 'Untitled Vanish'}</h1>
                  <div className="meta-info">
                    <span className="meta-item">
                      <FaCalendarAlt className="meta-icon" />
                      Created: {new Date(vanishData.createdAt).toLocaleString()}
                    </span>
                    {vanishData.expiresAt && (
                      <span className="meta-item">
                        <FaClock className="meta-icon" />
                        Expires: {new Date(vanishData.expiresAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="code-container">
                  <SyntaxHighlighter
                    language="java"
                    style={vscDarkPlus}
                    customStyle={{ borderRadius: '8px', padding: '20px' }}
                  >
                    {vanishData.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-text">
            <p>© 2025 VanishInk. All rights reserved | Made with <FaHeart className="heart-icon" /> by Aslam</p>
          </div>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/aslamsayyad02/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <span className="separator">|</span>
            <a href="https://github.com/aslams2020" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;