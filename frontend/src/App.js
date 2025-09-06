import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ServerNotice from './components/ServerNotice/ServerNotice';
import CreateVanish from './components/CreateVanish/CreateVanish';
import ViewVanish from './components/ViewVanish/ViewVanish';
import About from './components/About/About';
import { API_BASE_URL } from './utils/constants';
import './App.css';

function App() {
  const [view, setView] = useState('create');
  const [vanishId, setVanishId] = useState('');
  const [vanishData, setVanishData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showServerNotice, setShowServerNotice] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/about') {
      setView('about');
      setShowServerNotice(false); 
    } else if (path !== '/') {
      const id = path.substring(1);
      setVanishId(id);
      setView('view');
      setShowServerNotice(false); 
      fetchVanish(id);
    } else {
      setView('create');
      setShowServerNotice(true); 
    }
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    if (path === '/about') {
      setView('about');
      setShowServerNotice(false);
    } else {
      setView('create');
      setShowServerNotice(true);
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

  return (
    <div className="app">
      <Navbar navigateTo={navigateTo} />
      
      <div className="main-container">
        {view === 'about' ? (
          <About />
        ) : view === 'create' ? (
          <>
            <div className="hero-section">
              <h1>Share Code. Vanish Forever.</h1>
              <p>Create secure, temporary links for your code snippets & multiple files that automatically disappear.</p>
            </div>
            
            {showServerNotice && (
              <ServerNotice setShowServerNotice={setShowServerNotice} />
            )}
            
            <CreateVanish 
              setError={setError} 
              setLoading={setLoading} 
              loading={loading} 
              error={error}
            />
          </>
        ) : (
          <ViewVanish 
            vanishData={vanishData}
            loading={loading}
            error={error}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;