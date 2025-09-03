import React from 'react';
import { FaCode, FaShieldAlt, FaQrcode, FaClock, FaUsers } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>VanishInk Snippets⚡</h1>
        <p className="about-subtitle">Secure, ephemeral sharing for the modern developer</p>
      </div>

      <div className="about-content">
        <section className="about-story">
          <h2>Why I Built VanishInk</h2>
          <p>
            During hackathons and tech events, I noticed a common problem: developers needed to share code snippets, 
            API keys, or configuration files quickly, but were hesitant to exchange personal contact information 
            with strangers. WhatsApp groups and email exchanges felt intrusive for temporary collaborations.
          </p>
          <p>
            I created VanishInk to solve this - a platform where you can share technical content instantly without 
            the baggage of permanent connections. No sign-ups, no personal data exchange, just pure, focused 
            collaboration that respects everyone's privacy.
          </p>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaClock />
            </div>
            <h3>Ephemeral by Design</h3>
            <p>Content automatically disappears after your chosen duration - from 1 hour to 1 week. No digital clutter left behind.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <h3>Burn After Reading</h3>
            <p>Ultra-sensitive information? Enable one-time view links that self-destruct immediately after being accessed.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaQrcode />
            </div>
            <h3>QR Code Sharing</h3>
            <p>Share instantly in person without typing long URLs. Perfect for hackathons and pair programming sessions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaCode />
            </div>
            <h3>Multi-Format Support</h3>
            <p>Share more than just code - upload images, documents, and files alongside your text snippets.</p>
          </div>
        </section>

        <section className="use-cases">
          <h2>Perfect For</h2>
          <div className="use-cases-grid">
            <div className="use-case">
              <h4>👥 Hackathons & Events</h4>
              <p>Collaborate temporarily without exchanging personal contact information</p>
            </div>
            <div className="use-case">
              <h4>🔐 Sensitive Data Sharing</h4>
              <p>Share API keys, passwords, or config files that shouldn't persist indefinitely</p>
            </div>
            <div className="use-case">
              <h4>💻 Code Reviews</h4>
              <p>Quickly share code snippets for feedback without creating permanent gists</p>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <h2>Built With </h2>
          <div className="tech-list">
            <div className="tech-item">
              <span className="tech-label">Backend:</span>
              <span>Spring Boot, Java, MySQL</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Frontend:</span>
              <span>React.js, Modern CSS</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">File Storage:</span>
              <span>Cloudinary API</span>
            </div>
          </div>
        </section>

        <section className="final-note">
          <h2>Your Privacy Matters</h2>
          <p>
            VanishInk was built with privacy-first principles. No user tracking, no analytics, 
            no permanent storage of your content. What you share here truly vanishes - exactly as intended.
          </p>
          <p className="closing">
            Built by <a href="https://www.linkedin.com/in/aslamsayyad02/" target="_blank" rel="noopener noreferrer"> Aslam </a> 
            for developers who value efficiency and privacy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;