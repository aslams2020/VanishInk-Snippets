import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCopy, FaClock, FaCalendarAlt, FaFileAlt, FaDownload, FaExternalLinkAlt, FaFile } from 'react-icons/fa';
import './ViewVanish.css';

const ViewVanish = ({ vanishData, loading, error }) => {
  const [copied, setCopied] = useState(false);

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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!vanishData) {
    return null;
  }

  return (
    <div className="view-container">
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
          {(vanishData.contentType === 'FILE' || vanishData.contentType === 'IMAGE') && (
            <div className="files-content">
              {vanishData.files && vanishData.files.length > 0 ? (
                <>
                  <h3>Files ({vanishData.files.length})</h3>
                  {vanishData.files.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-info">
                        <FaFile className="file-icon" />
                        <div className="file-details">
                          <h4>{file.originalFileName || `File ${index + 1}`}</h4>
                          <p>{(file.fileSize / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <div className="content-actions">
                        <a
                          href={file.fileUrl}
                          download={file.originalFileName}
                          className="action-btn primary"
                        >
                          <FaDownload /> Download
                        </a>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn secondary"
                        >
                          <FaExternalLinkAlt /> Open
                        </a>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="file-item">
                  <div className="file-info">
                    <FaFile className="file-icon" />
                    <div className="file-details">
                      <h4>{vanishData.title || 'Download File'}</h4>
                      <p>File shared via VanishInk</p>
                    </div>
                  </div>
                  <div className="content-actions">
                    <a
                      href={vanishData.fileUrl}
                      download={vanishData.title}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewVanish;