import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { iddata } from '../../Components/api.js';
import { PageOverlayLoader } from '../../Components/Loader/Loader';
import Dark from '../../Components/Tmeplates/web/Dark/Dark';
import Light from '../../Components/Tmeplates/web/Light/Light';
import Modern from '../../Components/Tmeplates/web/modern/Modern';

const PortfolioLive = () => {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await iddata(id);
        if (res.data && res.data.success && res.data.data) {
          setTemplate(res.data.data.template || 'Dark');
        } else {
          setError(res.data?.message || 'Portfolio not found');
        }
      } catch (err) {
        console.error("Portfolio Live fetch error:", err);
        setError("Unable to load this portfolio. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id && id !== 'undefined') {
      fetchPortfolio();
    } else {
      setError("Invalid portfolio link.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <PageOverlayLoader message="Loading portfolio..." />;
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#121212', color: '#fff', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff6b6b' }}>Oops!</h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '400' }}>{error}</h2>
        <a href="/" style={{ marginTop: '2rem', padding: '10px 20px', backgroundColor: '#3b82f6', color: '#fff', textDecoration: 'none', borderRadius: '5px' }}>Go Home</a>
      </div>
    );
  }

  switch (template?.toLowerCase()) {
    case 'light':
      return <Light />;
    case 'modern':
      return <Modern />;
    case 'dark':
    default:
      return <Dark />;
  }
};

export default PortfolioLive;
