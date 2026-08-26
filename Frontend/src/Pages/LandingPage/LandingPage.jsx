import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStudentClick = () => {
    window.scrollTo(0, 0);
    navigate('/Log');
  };

  const handleBusinessClick = () => {
    window.scrollTo(0, 0);
    navigate('/business');
  };

  return (
    <div className="landing-container">
      {/* Navbar / Brand */}
      <nav className="landing-nav">
        <div className="brand-section">
          <img src="/logo.png" alt="Ascend Via Logo" className="brand-logo" />
          <span className="brand-name">Ascend Via</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <h1 className="hero-title">
          Build What You Need,<br/>
          <span className="highlight">The Way You Need It</span>
        </h1>
        <p className="hero-subtitle">Choose the path that best fits your goals.</p>
      </header>

      {/* Main Paths Section */}
      <main className="landing-paths">
        
        {/* Student Path */}
        <section className="path-card student-path">
          <div className="path-header">
            <span className="path-icon">🎓</span>
            <h2>STUDENT</h2>
          </div>
          <h3 className="path-title">Build Your Skills. Build Real Projects.</h3>
          <p className="path-description">
            Explore free templates and resources to start building your ideas. If you need something more advanced, get expert guidance and discuss your project requirements through a consultation.
          </p>
          
          <button className="cta-button student-btn" onClick={handleStudentClick}>
            Choose Student
          </button>
          
          <div className="journey-flow">
            <div className="journey-step">Explore Free Templates</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Need an Advanced Project?</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Book Consultation</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Requirement Discussion</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Project Planning</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Development</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Review & Delivery</div>
          </div>
        </section>

        {/* Business Path */}
        <section className="path-card business-path">
          <div className="path-header">
            <span className="path-icon">💼</span>
            <h2>BUSINESS</h2>
          </div>
          <h3 className="path-title">A Website Built Around Your Business</h3>
          <p className="path-description">
            Every business has different goals, customers, and challenges. We build customized websites based on your specific business requirements to help you create a stronger online presence and provide a better experience for your customers.
          </p>
          
          <button className="cta-button business-btn" onClick={handleBusinessClick}>
            Get a Custom Website
          </button>

          <div className="journey-flow">
            <div className="journey-step">Tell Us About Your Business</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Discuss Your Requirements</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Understand Your Business Problem</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Plan a Custom Solution</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Design & Development</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Review & Feedback</div>
            <div className="journey-arrow">↓</div>
            <div className="journey-step">Final Delivery</div>
          </div>
        </section>
      </main>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <h2>Why Choose Ascend Via?</h2>
        <ul className="benefits-list">
          <li>Customized Solutions</li>
          <li>Clear Requirement Discussion</li>
          <li>Modern & Responsive Development</li>
          <li>Simple and Transparent Process</li>
          <li>Support From Idea to Delivery</li>
        </ul>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <h2>Ready to Get Started?</h2>
        <div className="bottom-cta-buttons">
          <button className="cta-button student-btn" onClick={handleStudentClick}>Choose Student</button>
          <button className="cta-button business-btn" onClick={handleBusinessClick}>Get a Custom Website</button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;