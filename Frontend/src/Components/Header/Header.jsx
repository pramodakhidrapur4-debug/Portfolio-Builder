import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { 
  HiSparkles, 
  HiArrowRight, 
  HiCalendar, 
  HiCode, 
  HiUserGroup, 
  HiDocumentText, 
  HiCheckCircle,
  HiBriefcase,
  HiAcademicCap
} from 'react-icons/hi';

const Header = () => {
  const navigate = useNavigate();

  const handleCreatePortfolio = () => {
    const elem = document.getElementById('tt');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/DarkForm');
    }
  };

  const handleBookConsultation = () => {
    const elem = document.getElementById('Cont');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#Cont');
    }
  };

  return (
    <div className="hero-container">
      {/* Ambient background glows & grid */}
      <div className="hero-ambient">
        <div className="ambient-orb ambient-orb--1" />
        <div className="ambient-orb ambient-orb--2" />
        <div className="ambient-grid-overlay" />
      </div>

      <div className="hero-content">
        {/* Left Column: Content & CTAs */}
        <div className="hero-text-col">
          {/* Top Announcement Pill */}
          <div className="hero-pill">
            <HiSparkles className="hero-pill-icon" />
            <span>All-In-One Digital & Career Development Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            Build Your Digital Presence with{' '}
            <span className="hero-title-gradient">
              Professional Websites, Portfolios & Career Services
            </span>
          </h1>

          {/* Subheading */}
          <p className="hero-subtitle">
            Create stunning portfolio websites, custom business websites, and personal branding pages with modern designs. I also provide interview preparation, resume reviews, student project development, portfolio guidance, career consultation, and website planning to help students and businesses grow faster.
          </p>

          {/* Two Premium CTA Buttons */}
          <div className="hero-cta-group">
            <button className="hero-btn hero-btn--primary" onClick={handleCreatePortfolio}>
              <span>Create Portfolio</span>
              <HiArrowRight className="btn-icon" />
            </button>
            <button className="hero-btn hero-btn--secondary" onClick={handleBookConsultation}>
              <HiCalendar className="btn-icon-left" />
              <span>Book a Consultation</span>
            </button>
          </div>

          {/* Service Feature Tags */}
          <div className="hero-tags">
            <span className="tag-item"><HiCode /> Custom Websites</span>
            <span className="tag-item"><HiBriefcase /> Portfolio Builder</span>
            <span className="tag-item"><HiDocumentText /> Resume Review</span>
            <span className="tag-item"><HiAcademicCap /> Student Projects</span>
            <span className="tag-item"><HiUserGroup /> Career Consultation</span>
          </div>
        </div>

        {/* Right Column: Premium SaaS Showcase Visual */}
        <div className="hero-visual-col">
          <div className="hero-card-frame">
            {/* Window titlebar */}
            <div className="window-bar">
              <div className="window-dots">
                <span className="window-dot dot-red" />
                <span className="window-dot dot-yellow" />
                <span className="window-dot dot-green" />
              </div>
              <span className="window-title">Services & Development Hub</span>
            </div>

            {/* Inner Dashboard Content */}
            <div className="showcase-content">
              <div className="showcase-header-badge">
                <HiCheckCircle /> Trusted Digital Partner
              </div>
              
              <h3 className="showcase-heading">Everything You Need To Grow</h3>

              <div className="services-grid">
                <div className="service-mini-card">
                  <div className="service-mini-icon icon-blue"><HiCode /></div>
                  <div className="service-mini-text">
                    <h4>Web Development</h4>
                    <p>Modern Business & SaaS Sites</p>
                  </div>
                </div>

                <div className="service-mini-card">
                  <div className="service-mini-icon icon-purple"><HiBriefcase /></div>
                  <div className="service-mini-text">
                    <h4>Portfolio Websites</h4>
                    <p>Personal Branding & Showcase</p>
                  </div>
                </div>

                <div className="service-mini-card">
                  <div className="service-mini-icon icon-amber"><HiAcademicCap /></div>
                  <div className="service-mini-text">
                    <h4>Student Projects</h4>
                    <p>Development & Mentorship</p>
                  </div>
                </div>

                <div className="service-mini-card">
                  <div className="service-mini-icon icon-emerald"><HiDocumentText /></div>
                  <div className="service-mini-text">
                    <h4>Career Guidance</h4>
                    <p>Resume & Interview Prep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="floating-badge badge-top-right">
              <span className="stat-number">100%</span>
              <span className="stat-label">Personalized Guidance</span>
            </div>

            <div className="floating-badge badge-bottom-left">
              <span className="stat-number">⚡ Fast</span>
              <span className="stat-label">Delivery & Deployment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
