import React from 'react';
import './Footer.css';
import { 
  HiPhone, 
  HiMail, 
  HiChevronRight, 
  HiSparkles,
  HiCheckCircle
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (targetId, fallbackPath) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-container">
      {/* Top Ambient Glow Effect */}
      <div className="footer-ambient-glow" />

      <div className="footer-content">
        {/* Main Grid */}
        <div className="footer-grid">
          
          {/* Column 1: About */}
          <div className="footer-col footer-col--about">
            <div className="footer-brand">
              <div className="footer-logo">
                <HiSparkles className="footer-logo-icon" />
              </div>
              <h2 className="footer-brand-title">AscendVia</h2>
            </div>
            <p className="footer-about-text">
              AscendVia helps individuals, students, freelancers, and businesses build a strong online presence. Along with portfolio website creation, we provide custom website development, interview preparation, resume reviews, student project development, website consultation, UI/UX guidance, and career support.
            </p>
            <div className="footer-trust-badge">
              <HiCheckCircle className="badge-icon" />
              <span>Building Careers & Digital Brands</span>
            </div>
          </div>

          {/* Column 2: Our Services */}
          <div className="footer-col">
            <h3 className="footer-heading">
              Our Services
              <span className="heading-line" />
            </h3>
            <ul className="footer-list">
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Portfolio Website Development</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Custom Business Website Development</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Resume Review</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Interview Preparation</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Student Project Development</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Website Consultation</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>UI/UX Guidance</span>
              </li>
              <li>
                <HiChevronRight className="list-arrow" />
                <span>Career Support</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">
              Quick Links
              <span className="heading-line" />
            </h3>
            <ul className="footer-list footer-links-list">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <HiChevronRight className="list-arrow" /> Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('tt', '/')}>
                  <HiChevronRight className="list-arrow" /> Templates
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('Cont', '/')}>
                  <HiChevronRight className="list-arrow" /> Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('Cont', '/')}>
                  <HiChevronRight className="list-arrow" /> Contact
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('Cont', '/')}>
                  <HiChevronRight className="list-arrow" /> Book Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="footer-col footer-col--contact">
            <h3 className="footer-heading">
              Contact Information
              <span className="heading-line" />
            </h3>
            
            <div className="contact-cards">
              {/* Phone Card */}
              <a href="tel:+917026136116" className="contact-card">
                <div className="contact-icon-wrapper icon-phone">
                  <HiPhone />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">+91 7026136116</span>
                </div>
              </a>

              {/* Email Card */}
              <a href="mailto:brijjeshmalakappnavar@gmail.com" className="contact-card">
                <div className="contact-icon-wrapper icon-email">
                  <HiMail />
                </div>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <span className="contact-value email-value">brijjeshmalakappnavar@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Footer Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-divider" />
          <div className="footer-bottom-content">
            <p className="copyright-text">
              © 2026 AscendVia. All Rights Reserved.
            </p>
            <p className="credits-text">
              Designed & Developed by AscendVia.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
