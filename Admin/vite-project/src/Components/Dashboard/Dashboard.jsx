import { useState, useEffect } from "react";
import {
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineCollection,
  HiOutlineCurrencyRupee,
  HiOutlineGlobe,
  HiOutlineUser,
} from "react-icons/hi";
import { getStats } from "../api";
import { StatCardSkeleton } from "../UI/Skeleton";
import { useToast } from "../UI/Toast";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      if (res.data.success) {
        setStats(res.data.stats);
        setRecent(res.data.recentActivity);
      }
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const STAT_CARDS = stats
    ? [
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: <HiOutlineUsers />,
          color: "purple",
        },
        {
          label: "Google Users",
          value: stats.googleUsers,
          icon: <HiOutlineGlobe />,
          color: "info",
        },
        {
          label: "Normal Users",
          value: stats.normalUsers,
          icon: <HiOutlineUser />,
          color: "neutral",
        },
        {
          label: "Paid Users",
          value: stats.paidUsers,
          icon: <HiOutlineCreditCard />,
          color: "success",
        },
        {
          label: "Total Revenue",
          value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
          icon: <HiOutlineCurrencyRupee />,
          color: "warning",
        },
        {
          label: "Total Portfolios",
          value: stats.totalPortfolios,
          icon: <HiOutlineCollection />,
          color: "info",
        },
      ]
    : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Welcome back! Here's what's happening with your platform.</p>
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────── */}
      {loading ? (
        <StatCardSkeleton count={6} />
      ) : (
        <div className="stats-grid">
          {STAT_CARDS.map((card, i) => (
            <div
              className={`stat-card stat-card--${card.color}`}
              key={card.label}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="stat-card__header">
                <span className="stat-card__label">{card.label}</span>
                <div className={`stat-card__icon stat-card__icon--${card.color}`}>
                  {card.icon}
                </div>
              </div>
              <div className="stat-card__value">{card.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Recent Activity ─────────────────────────────────── */}
      {!loading && recent && (
        <div className="recent-activity">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-grid">
            {/* Recent Users */}
            <div className="activity-card glass-card">
              <h3>Recent Sign-ups</h3>
              <div className="activity-list">
                {[...(recent.users || []), ...(recent.googleUsers || [])]
                  .slice(0, 6)
                  .map((u, i) => (
                    <div className="activity-item" key={u._id || i}>
                      <div className="activity-item__avatar">
                        {u.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="activity-item__info">
                        <span className="activity-item__name">{u.name}</span>
                        <span className="activity-item__meta">{u.email}</span>
                      </div>
                      <span className="activity-item__date">
                        {formatDate(u.data)}
                      </span>
                    </div>
                  ))}
                {(!recent.users?.length && !recent.googleUsers?.length) && (
                  <p className="activity-empty">No recent sign-ups</p>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div className="activity-card glass-card">
              <h3>Recent Payments</h3>
              <div className="activity-list">
                {(recent.payments || []).slice(0, 5).map((p, i) => (
                  <div className="activity-item" key={p._id || i}>
                    <div className="activity-item__avatar activity-item__avatar--success">
                      ₹
                    </div>
                    <div className="activity-item__info">
                      <span className="activity-item__name">
                        {p.userName || "User"}
                      </span>
                      <span className="activity-item__meta">
                        ₹{p.amount?.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="badge badge--success">
                      {p.status}
                    </span>
                  </div>
                ))}
                {!recent.payments?.length && (
                  <p className="activity-empty">No recent payments</p>
                )}
              </div>
            </div>

            {/* Recent Portfolios */}
            <div className="activity-card glass-card">
              <h3>Recent Portfolios</h3>
              <div className="activity-list">
                {(recent.portfolios || []).slice(0, 5).map((p, i) => (
                  <div className="activity-item" key={p._id || i}>
                    <div className="activity-item__avatar activity-item__avatar--purple">
                      {p.template?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <div className="activity-item__info">
                      <span className="activity-item__name">{p.name}</span>
                      <span className="activity-item__meta">
                        {p.template} Template
                      </span>
                    </div>
                    <span className="activity-item__date">
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                ))}
                {!recent.portfolios?.length && (
                  <p className="activity-empty">No recent portfolios</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
