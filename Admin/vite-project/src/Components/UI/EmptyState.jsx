import "./UI.css";

/**
 * Empty state with SVG illustration and optional action.
 * Props:
 *  - title: string
 *  - message: string
 *  - actionLabel: string (optional)
 *  - onAction: () => void (optional)
 */
const EmptyState = ({ title = "No data yet", message = "", actionLabel, onAction }) => (
  <div className="empty-state">
    {/* Inline SVG illustration — simple abstract shapes */}
    <svg
      className="empty-state__illustration"
      width="160"
      height="140"
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="30" y="40" width="100" height="72" rx="8" fill="rgba(108,92,231,0.08)" stroke="rgba(108,92,231,0.25)" strokeWidth="1.5" />
      <rect x="44" y="56" width="48" height="6" rx="3" fill="rgba(108,92,231,0.18)" />
      <rect x="44" y="68" width="72" height="6" rx="3" fill="rgba(255,255,255,0.06)" />
      <rect x="44" y="80" width="60" height="6" rx="3" fill="rgba(255,255,255,0.04)" />
      <rect x="44" y="92" width="40" height="6" rx="3" fill="rgba(255,255,255,0.04)" />
      <circle  r="18" fill="rgba(108,92,231,0.12)" stroke="rgba(108,92,231,0.3)" strokeWidth="1.5" cx="125" cy="30" />
      <path d="M120 24v12M114 30h12" stroke="rgba(108,92,231,0.5)" strokeWidth="2" strokeLinecap="round" transform="translate(5, 0)" />
    </svg>
    <h3 className="empty-state__title">{title}</h3>
    {message && <p className="empty-state__message">{message}</p>}
    {actionLabel && (
      <button className="btn btn--primary" onClick={onAction}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
