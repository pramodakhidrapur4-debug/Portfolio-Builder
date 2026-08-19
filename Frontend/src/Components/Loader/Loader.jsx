import React from 'react';
import './Loader.css';
import { HiSparkles } from 'react-icons/hi';

/**
 * Full Page Loading Overlay
 * Used for page navigation, API fetching, uploads, and payments
 */
export const PageOverlayLoader = ({ message = "Loading..." }) => {
  return (
    <div className="global-loader-overlay">
      <div className="global-loader-card">
        <div className="loader-spinner-wrapper">
          <div className="spinner-outer-ring" />
          <div className="spinner-inner-ring" />
          <HiSparkles className="spinner-icon" />
        </div>
        <div className="loader-message">{message}</div>
        <div className="loader-progress-bar">
          <div className="loader-progress-fill" />
        </div>
      </div>
    </div>
  );
};

/**
 * Inline Button Spinner
 * Rendered inside buttons when in loading state
 */
export const ButtonSpinner = ({ label = "Loading..." }) => {
  return (
    <span className="btn-spinner-content">
      <span className="btn-spinner-ring" />
      <span>{label}</span>
    </span>
  );
};

/**
 * Skeleton Loader Component
 * Rendered while cards/content are fetching
 */
export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-sub" />
          <div className="skeleton-box" />
        </div>
      ))}
    </div>
  );
};

export default PageOverlayLoader;
