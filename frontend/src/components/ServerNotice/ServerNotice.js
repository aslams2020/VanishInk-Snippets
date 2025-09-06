import React from 'react';
import './ServerNotice.css';

const ServerNotice = ({ setShowServerNotice }) => {
  return (
    <div className="server-notice-banner">
      <div className="server-notice-banner-content">
        <p>
          <span> <strong>⚡Server Notice :)</strong> </span>
          I Hosted this on <strong>Render's free tier. </strong>
          First request may take 30-60 seconds to wake up the server.
          Thank you for your understanding! 🙌
        </p>
        <button
          onClick={() => setShowServerNotice(false)}
          className="server-notice-banner-close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ServerNotice;