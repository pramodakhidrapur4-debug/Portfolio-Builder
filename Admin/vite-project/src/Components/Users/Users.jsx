import React, { useState, useEffect, useMemo } from "react";
import { getAllUsers } from "../api";
import { TableSkeleton } from "../UI/Skeleton";
import EmptyState from "../UI/EmptyState";
import { useToast } from "../UI/Toast";
import "./Users.css";

const ITEMS_PER_PAGE = 10;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      if (res.data && res.data.success) {
        setUsers(res.data.users || []);
      } else {
        toast.error("Failed to load users");
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // ── Filter + Search + Sort pipeline ───────────────────────
  const processed = useMemo(() => {
    let result = [...users];

    // Filter
    if (filter === "Google") result = result.filter((u) => u.loginType === "Google");
    else if (filter === "Normal") result = result.filter((u) => u.loginType === "Normal");
    else if (filter === "Premium" || filter === "Paid") result = result.filter((u) => u.isPremium);
    else if (filter === "Free") result = result.filter((u) => !u.isPremium);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "newest") result.sort((a, b) => new Date(b.joinDate || 0) - new Date(a.joinDate || 0));
    else if (sortBy === "oldest") result.sort((a, b) => new Date(a.joinDate || 0) - new Date(b.joinDate || 0));
    else if (sortBy === "name") result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    else if (sortBy === "portfolios") result.sort((a, b) => (b.portfolioCount || 0) - (a.portfolioCount || 0));

    return result;
  }, [users, search, filter, sortBy]);

  // ── Pagination ────────────────────────────────────────────
  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE) || 1;
  const paginated = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sortBy]);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p>Manage all registered users, Google logins, normal accounts, and premium status</p>
        </div>
        <span className="badge badge--neutral">{users.length} Total Registered Users</span>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Users ({users.length})</option>
          <option value="Google">Google Logins</option>
          <option value="Normal">Normal Logins</option>
          <option value="Paid">Paid / Premium Users</option>
          <option value="Free">Free Users</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A-Z</option>
          <option value="portfolios">Most Portfolios</option>
        </select>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      {loading ? (
        <div className="data-table-wrapper">
          <TableSkeleton rows={8} cols={6} />
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          title="No users found"
          message={search || filter !== "All" ? "Try adjusting your search query or dropdown filters" : "No users have registered yet"}
        />
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Login Type</th>
                  <th>Join Date</th>
                  <th>Status</th>
                  <th>Portfolios</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <React.Fragment key={user._id}>
                    <tr
                      className="user-row"
                      onClick={() =>
                        setExpandedId(expandedId === user._id ? null : user._id)
                      }
                    >
                      <td className="text-primary">
                        <div className="user-name-cell">
                          <div className="user-avatar">
                            {user.picture ? (
                              <img src={user.picture} alt={user.name} />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase() || "?"
                            )}
                          </div>
                          {user.name}
                        </div>
                      </td>
                      <td>{user.email || "—"}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.loginType === "Google"
                              ? "badge--info"
                              : "badge--neutral"
                          }`}
                        >
                          {user.loginType}
                        </span>
                      </td>
                      <td>{formatDate(user.joinDate)}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.isPremium ? "badge--success" : "badge--neutral"
                          }`}
                        >
                          {user.isPremium ? "Paid User" : "Free"}
                        </span>
                      </td>
                      <td>{user.portfolioCount}</td>
                    </tr>
                    {/* Expanded row */}
                    {expandedId === user._id && (
                      <tr className="user-detail-row">
                        <td colSpan={6}>
                          <div className="user-detail">
                            <div className="user-detail__item">
                              <span>Full Name</span>
                              <strong>{user.name}</strong>
                            </div>
                            <div className="user-detail__item">
                              <span>Email</span>
                              <strong>{user.email || "—"}</strong>
                            </div>
                            {user.contact_no && (
                              <div className="user-detail__item">
                                <span>Contact Number</span>
                                <strong>{user.contact_no}</strong>
                              </div>
                            )}
                            <div className="user-detail__item">
                              <span>Login Type</span>
                              <strong>{user.loginType}</strong>
                            </div>
                            <div className="user-detail__item">
                              <span>Join Date</span>
                              <strong>{formatDate(user.joinDate)}</strong>
                            </div>
                            <div className="user-detail__item">
                              <span>Membership Status</span>
                              <strong>{user.isPremium ? "Paid / Premium Member" : "Free Tier"}</strong>
                            </div>
                            <div className="user-detail__item">
                              <span>Portfolios Created</span>
                              <strong>{user.portfolioCount}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="pagination">
              <span className="pagination-info">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, processed.length)} of{" "}
                {processed.length}
              </span>
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                  })
                  .map((p, idx, arr) => (
                    <span key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <button disabled className="pagination-ellipsis">
                          …
                        </button>
                      )}
                      <button
                        className={currentPage === p ? "active" : ""}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    </span>
                  ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
