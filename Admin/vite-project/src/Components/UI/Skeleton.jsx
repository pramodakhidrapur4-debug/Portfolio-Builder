import "./UI.css";

/**
 * Loading skeleton components for tables, stat cards, etc.
 */

// Single shimmer row for tables
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="skeleton-table">
    {Array.from({ length: rows }).map((_, i) => (
      <div className="skeleton-row" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
        {Array.from({ length: cols }).map((_, j) => (
          <div className="skeleton-cell" key={j} />
        ))}
      </div>
    ))}
  </div>
);

// Stat card skeleton for dashboard
export const StatCardSkeleton = ({ count = 6 }) => (
  <div className="stat-skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div className="skeleton-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-line skeleton-line--xs" />
      </div>
    ))}
  </div>
);

// Generic block skeleton
export const BlockSkeleton = ({ width = "100%", height = "20px" }) => (
  <div className="skeleton-block" style={{ width, height }} />
);
