import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaGithub, FaEnvelope, FaUser, FaCopy, FaClock, FaCalendarAlt, FaHeart, FaFileAlt, FaDownload, FaExternalLinkAlt, FaFile } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import About from './components/About';
import './App.css';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : 'https://vanishink-snippets.onrender.com';

function App() {
  const [view, setView] = useState('create');
  const [vanishId, setVanishId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiryTime, setExpiryTime] = useState('1h');
  const [createdUrl, setCreatedUrl] = useState('');
  const [vanishData, setVanishData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [isOneTime, setIsOneTime] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isCustomExpiry, setIsCustomExpiry] = useState(false);
  const [customTimeValue, setCustomTimeValue] = useState(1);
  const [customTimeUnit, setCustomTimeUnit] = useState('hours');


  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/about') {
      setView('about');
    } else if (path !== '/') {
      const id = path.substring(1);
      setVanishId(id);
      setView('view');
      fetchVanish(id);
    } else {
      setView('create');
    }
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    if (path === '/about') {
      setView('about');
    } else {
      setView('create');
    }
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value;
    setExpiryTime(value);
    setIsCustomExpiry(value === 'custom');
  };

  // to handle custom time
  const prepareExpiryTime = () => {
    if (expiryTime === 'custom') {
      return `${customTimeValue}${customTimeUnit.charAt(0)}`;
    }
    return expiryTime;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate custom time
    if (isCustomExpiry) {
      if (customTimeValue < 1) {
        setError('Duration must be at least 1');
        setLoading(false);
        return;
      }

      // Set reasonable limits
      const maxValues = {
        minutes: 525600, // 1 year in minutes
        hours: 8760,     // 1 year in hours
        days: 365,       // 1 year
        weeks: 52        // 1 year
      };

      if (customTimeValue > maxValues[customTimeUnit]) {
        setError(`Duration cannot exceed 1 year for ${customTimeUnit}`);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    setError('');

    const finalExpiryTime = prepareExpiryTime();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('expiryTime', finalExpiryTime);
    formData.append('isOneTime', isOneTime);

    if (file) {
      formData.append('file', file); // Append the file
    } else {
      formData.append('content', content); // Append text content
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/vanish`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const vanishId = data.url;
        const userFriendlyUrl = `${window.location.origin}/${vanishId}`;
        setCreatedUrl(userFriendlyUrl);
        setShowQr(true);

        setTitle('');
        setContent('');
        setExpiryTime('1h');
        setFile(null);
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
      const response = await fetch(`${API_BASE_URL}/api/vanish/${id}`);
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

  const copyContentToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy content: ', fallbackErr);
        alert('Failed to copy content to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setContent(''); // Clear text content when file is selected
    }
  };

  return (
    <div className="app">

      <nav className="navbar">
        <div className="nav-brand">
          <a href="/" className='logo-left'><h2>Vanish-Ink</h2></a>
        </div>
        <div className="nav-links">
          <a href="https://github.com/aslams2020/VanishInk-Snippets" target="_blank" rel="noopener noreferrer">
            <FaGithub className="nav-icon" />
          </a>
          <a href="mailto:sayyadaslam2020@gmail.com">
            <FaEnvelope className="nav-icon" />
          </a>
          <span onClick={() => navigateTo('/about')} className="nav-span" style={{ cursor: 'pointer' }}>
            About
          </span>
        </div>
      </nav>

      <div className="main-container">
        {view === 'about' ? (
          <About />
        ) : view === 'create' ? (
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
                  placeholder="Add a title to Vanish"
                />
              </div>

              <div className="form-group">
                <label htmlFor="file" className="form-label">Upload a File/Image</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <label htmlFor="file" className="file-input-label">
                    <FaFileAlt className="file-input-icon" />
                    {file ? file.name : 'Choose a file'}
                  </label>
                </div>
                {file && (
                  <button
                    type="button"
                    className="clear-file-btn"
                    onClick={() => setFile(null)}
                  >
                    Remove File
                  </button>
                )}
              </div>
              {!file && (
                <div className="form-group">
                  <label htmlFor="content" className="form-label">Or Content</label>
                  <textarea
                    id="content"
                    className="form-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your text or code here..."
                    rows="7"
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group expiry-group">
                  <label htmlFor="expiryTime" className="form-label">Expiry Time</label>
                  <select
                    id="expiryTime"
                    className="form-select"
                    value={expiryTime}
                    onChange={handleExpiryChange}
                  >
                    <option value="1h">1 Hour</option>
                    <option value="1d">1 Day</option>
                    <option value="1w">1 Week</option>
                    <option value="custom">Custom...</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {isCustomExpiry && (
                  <div className="custom-time-container">
                    <div className="form-group">
                      <label htmlFor="customTimeValue" className="form-label">Duration</label>
                      <input
                        id="customTimeValue"
                        type="number"
                        min="1"
                        max="999"
                        className="form-input"
                        value={customTimeValue}
                        onChange={(e) => setCustomTimeValue(parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customTimeUnit" className="form-label">Unit</label>
                      <select
                        id="customTimeUnit"
                        className="form-select"
                        value={customTimeUnit}
                        onChange={(e) => setCustomTimeUnit(e.target.value)}
                      >
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                      </select>
                    </div>
                  </div>
                )}

                <button type="submit" className="create-btn" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Vanish Link ✨'}
                </button>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkmark"></span>
                  Burn after reading (One-Time Link)?
                </label>
                <p className="checkbox-description">(Note: If Enabled,<strong>  This vanish will be destroyed immediately </strong> after being viewed once.)</p>
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

                {showQr && (
                  <div className="qr-section">
                    <h3>Quick Share QR Code</h3>
                    <div className="qr-code-container">
                      <QRCodeSVG
                        value={createdUrl}
                        size={200}
                        level="H" // High error correction (30%)
                        includeMargin={true}
                        fgColor="#2c2c54"
                        bgColor="#f9f9f9"
                      />
                    </div>
                    <p className="qr-note">Scan this code with any smartphone camera to open the link instantly.</p>
                  </div>
                )}

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
                    <span className="meta-item type-badge">
                      <FaFileAlt className="meta-icon" />
                      Type: {vanishData.contentType?.toLowerCase() || 'text'}
                    </span>
                  </div>
                </div>

                <div className="content-container">
                  {/* TEXT Content */}
                  {(!vanishData.contentType || vanishData.contentType === 'TEXT') && (
                    <div className="text-content">
                      <div className="syntax-highlighter-wrapper">
                        <button
                          onClick={() => copyContentToClipboard(vanishData.content)}
                          className="copy-inline-btn"
                          title="Copy content to clipboard"
                        >
                          {copied ? 'Copied!' : <FaCopy />}
                        </button>
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

                  {/* IMAGE Content */}
                  {vanishData.contentType === 'IMAGE' && (
                    <div className="image-content">
                      <div className="image-wrapper">
                        <img
                          src={vanishData.fileUrl}
                          alt={vanishData.title || 'VanishInk Image'}
                          className="uploaded-image"
                        />
                      </div>
                      <div className="content-actions">
                        <a
                          href={vanishData.fileUrl}
                          download
                          className="action-btn primary"
                        >
                          <FaDownload /> Download Image
                        </a>
                      </div>
                    </div>
                  )}

                  {/* FILE Content */}
                  {vanishData.contentType === 'FILE' && (
                    <div className="file-content">
                      <div className="file-info">
                        <FaFile className="file-icon" />
                        <div className="file-details">
                          <h3>{vanishData.originalFileName || 'Download File'}</h3>
                          <p>File shared via VanishInk</p>
                        </div>
                      </div>
                      <div className="content-actions">
                        <a
                          href={vanishData.fileUrl}
                          download
                          className="action-btn primary"
                        >
                          <FaDownload /> Download File
                        </a>
                        <a
                          href={vanishData.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn secondary"
                        >
                          <FaExternalLinkAlt /> Open in New Tab
                        </a>
                      </div>
                    </div>
                  )}
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