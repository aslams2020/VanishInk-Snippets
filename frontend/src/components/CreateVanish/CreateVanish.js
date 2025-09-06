import React, { useState } from 'react';
import { FaCopy, FaFileAlt, FaHeart } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { API_BASE_URL } from '../../utils/constants';
import './CreateVanish.css';

const CreateVanish = ({ setError, setLoading, loading, error }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [expiryTime, setExpiryTime] = useState('1h');
  const [isOneTime, setIsOneTime] = useState(false);
  const [createdUrl, setCreatedUrl] = useState('');
  const [showQr, setShowQr] = useState(false);
  const [isCustomExpiry, setIsCustomExpiry] = useState(false);
  const [customTimeValue, setCustomTimeValue] = useState(1);
  const [customTimeUnit, setCustomTimeUnit] = useState('hours');
  const [copied, setCopied] = useState(false);

  const handleExpiryChange = (e) => {
    const value = e.target.value;
    setExpiryTime(value);
    setIsCustomExpiry(value === 'custom');
  };

  const prepareExpiryTime = () => {
    if (expiryTime === 'custom') {
      return `${customTimeValue}${customTimeUnit.charAt(0)}`;
    }
    return expiryTime;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (files.length > 0 && !validateFiles(files)) {
      setLoading(false);
      return;
    }

    if (isCustomExpiry) {
      if (customTimeValue < 1) {
        setError('Duration must be at least 1');
        setLoading(false);
        return;
      }

      const maxValues = {
        minutes: 525600,
        hours: 8760,
        days: 365,
        weeks: 52
      };

      if (customTimeValue > maxValues[customTimeUnit]) {
        setError(`Duration cannot exceed 1 year for ${customTimeUnit}`);
        setLoading(false);
        return;
      }
    }

    const finalExpiryTime = prepareExpiryTime();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('expiryTime', finalExpiryTime);
    formData.append('isOneTime', isOneTime);

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append('file', file);
      });
    } else {
      formData.append('content', content);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/vanish`, {
        method: 'POST',
        body: formData,
      });

      if (response.status === 413) {
        setError('File size too large. Maximum file size is 10MB.');
      }
      else if (response.ok) {
        const data = await response.json();
        const vanishId = data.url;
        const userFriendlyUrl = `${window.location.origin}/${vanishId}`;
        setCreatedUrl(userFriendlyUrl);
        setShowQr(true);

        setTitle('');
        setContent('');
        setExpiryTime('1h');
        setFiles([]);
      } else {
        setError('❌ Failed to create the Vanish.');
      }
    } catch (err) {
      setError('⚠️ An error occurred. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const removeFile = (indexToRemove) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const validateFiles = (files) => {
    const maxSize = 10 * 1024 * 1024;
    const tooLargeFiles = files.filter(file => file.size > maxSize);

    if (tooLargeFiles.length > 0) {
      const fileNames = tooLargeFiles.map(file => file.name).join(', ');
      setError(`The following files exceed the 10MB limit: ${fileNames}. Please choose smaller files.`);
      return false;
    }

    return true;
  };

  const addMoreFiles = (e) => {
    const newFiles = Array.from(e.target.files);

    if (newFiles.length > 0) {
      if (!validateFiles(newFiles)) {
        e.target.value = '';
        return;
      }

      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setContent('');
    }
    e.target.value = '';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdUrl);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="create-container">
      {/* <div className="hero-section">
        <h1>Share Code. Vanish Forever.</h1>
        <p>Create secure, temporary links for your code snippets & multiple files that automatically disappear.</p>
      </div> */}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            type="text"
            className="form-input"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title to Vanish"
          />
        </div>

        <div className="form-group">
          <label htmlFor="files" className="form-label">
            Upload Files/Images
          </label>
          <div className="file-input-container">
            <input
              type="file"
              id="files"
              multiple
              onChange={addMoreFiles}
              className="file-input"
            />
            <p className="file-helper-text">
              (Maximum 10MB per file. Supported formats: images, documents, PDFs, etc.)
            </p>
            <label htmlFor="files" className="file-input-label">
              <FaFileAlt className="file-input-icon" />
              {files.length > 0 ? `Add more files (${files.length} selected)` : 'Choose files'}
            </label>
          </div>
          {files.length > 0 && (
            <div className="selected-files">
              <h4>Selected Files ({files.length}):</h4>
              <ul>
                {files.map((file, index) => {
                  const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
                  const isTooLarge = file.size > 10 * 1024 * 1024;

                  return (
                    <li key={index} className={`file-item ${isTooLarge ? 'file-too-large' : ''}`}>
                      <span className="file-name">
                        {file.name} <span className="file-size">({fileSizeMB} MB)</span>
                        {isTooLarge && <span className="size-warning"> ⚠️ Too large!</span>}
                      </span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => removeFile(index)}
                        title="Remove this file"
                      >
                        ×
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                className="clear-file-btn"
                onClick={clearFiles}
              >
                Remove All Files
              </button>
            </div>
          )}
        </div>

        {!(files.length > 0) && (
          <div className="form-group">
            <label htmlFor="content" className="form-label">Or Text Content</label>
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
                  level="H"
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
  );
};

export default CreateVanish;