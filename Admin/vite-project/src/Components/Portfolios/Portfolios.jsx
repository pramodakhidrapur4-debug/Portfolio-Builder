import { useState, useEffect, useMemo } from "react";
import { HiExternalLink } from "react-icons/hi";
import { getAllPortfolios } from "../api";
import { TableSkeleton } from "../UI/Skeleton";
import EmptyState from "../UI/EmptyState";
import { useToast } from "../UI/Toast";
import "./Portfolios.css";

const ITEMS_PER_PAGE = 10;

// Badge color by template
const TEMPLATE_BADGE = {
  Dark: "badge--neutral",
  Light: "badge--warning",
  Modern: "badge--info",
};

const Portfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const res = await getAllPortfolios();
      if (res.data.success) {
        setPortfolios(res.data.portfolios);
      }
    } catch (err) {
      toast.error("Failed to load portfolios");
    } finally {
      setLoading(false);
    }
  };

  const processed = useMemo(() => {
    let result = [...portfolios];

    if (templateFilter !== "All") {
      result = result.filter(
        (p) => p.template?.toLowerCase() === templateFilter.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.creator?.name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [portfolios, search, templateFilter]);

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, templateFilter]);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openPortfolio = (id) => {
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "https://portfoliobuilder-three.vercel.app";
    window.open(`${frontendUrl}/portfolio/${id}`, "_blank");
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Portfolios</h1>
          <p>Manage all portfolios created by users</p>
        </div>
        <span className="badge badge--neutral">{portfolios.length} portfolios</span>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title or creator..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={templateFilter}
          onChange={(e) => setTemplateFilter(e.target.value)}
        >
          <option value="All">All Templates</option>
          <option value="Dark">Dark</option>
          <option value="Light">Light</option>
          <option value="Modern">Modern</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="data-table-wrapper">
          <TableSkeleton rows={8} cols={5} />
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          title="No portfolios found"
          message={
            search || templateFilter !== "All"
              ? "Try adjusting your search or filter"
              : "No portfolios have been created yet"
          }
        />
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Template</th>
                  <th>Portfolio Title</th>
                  <th>Creator</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <span
                        className={`badge ${
                          TEMPLATE_BADGE[p.template] || "badge--neutral"
                        }`}
                      >
                        {p.template || "Unknown"}
                      </span>
                    </td>
                    <td className="text-primary">{p.title}</td>
                    <td>
                      <div>
                        <span className="portfolio-creator-name">
                          {p.creator?.name || "Unknown"}
                        </span>
                        <span className="portfolio-creator-email">
                          {p.creator?.email}
                        </span>
                      </div>
                    </td>
                    <td>{formatDate(p.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn--secondary btn--sm"
                        onClick={() => openPortfolio(p._id)}
                      >
                        <HiExternalLink /> View Live
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? "active" : ""}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
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

export default Portfolios;
