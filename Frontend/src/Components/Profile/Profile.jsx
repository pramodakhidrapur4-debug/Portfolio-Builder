import { useState, useEffect } from 'react';
import { prof, portLink } from '../api';
import './Profile.css';
import { useNavigate } from "react-router-dom";
import { PageOverlayLoader, CardSkeleton } from '../Loader/Loader';

const Profile = () => {
  const navigate = useNavigate();

  const [Pro, setPro] = useState(null);
  const [Port, Setport] = useState(null);
  const [loading, setLoading] = useState(true);

  const portf = async () => {
    try {
      const res = await portLink();
      if (res.data && res.data.success) {
        Setport(res.data.portfolios);
      }
    } catch (error) {
      console.error("Profile portfolios error:", error.message);
    }
  };

  const showpr = async () => {
    try {
      const res = await prof();
      if (res.data && res.data.success) {
        setPro(res.data.user);
      }
    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showpr();
    portf();
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <PageOverlayLoader message="Loading your profile & portfolios..." />
          <h1 className="profile-title">My Profile</h1>
          <CardSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className='profile-page'>
      <div className="profile-content">
        <h1 className="profile-title">My Profile</h1>

        {/* User Info Card */}
        {Pro && (
          <div className="profile-card">
            <div className="profile-avatar">
              {getInitials(Pro.name)}
            </div>
            <div className="profile-details">
              <h2 className="profile-name">{Pro.name}</h2>
              <p className="profile-email">
                <svg className="profile-email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                {Pro.email}
              </p>
              <div className="profile-badge">
                <span className="profile-badge-dot"></span>
                Portfolio Creator
              </div>
            </div>
          </div>
        )}

        {/* Portfolios Section */}
        <div className="portfolios-section">
          <div className="portfolios-header">
            <h2 className="portfolios-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Your Portfolios
              {Port && Port.length > 0 && (
                <span className="portfolios-count">{Port.length}</span>
              )}
            </h2>
          </div>

          {Port && Port.length > 0 ? (
            <div className="portfolios-grid">
              {Port.map((item) => (
                <div
                  className="portfolio-card"
                  key={item._id}
                  onClick={() => navigate(`/portfolio/${item._id}`)}
                >
                  <div className="portfolio-icon">
                    🌐
                  </div>
                  <div className="portfolio-meta">
                    <h3 className="portfolio-template-name">{item.template}</h3>
                    <p className="portfolio-user-name">{item.name}</p>
                  </div>
                  <div className="portfolio-arrow">
                    View Portfolio
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portfolios-empty">
              <div className="empty-icon">📂</div>
              <h3 className="empty-title">No portfolios yet</h3>
              <p className="empty-text">Create your first portfolio to see it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;