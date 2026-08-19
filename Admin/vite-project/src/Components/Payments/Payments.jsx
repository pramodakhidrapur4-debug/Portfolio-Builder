import { useState, useEffect, useMemo } from "react";
import { getAllPayments } from "../api";
import { TableSkeleton } from "../UI/Skeleton";
import EmptyState from "../UI/EmptyState";
import { useToast } from "../UI/Toast";
import "./Payments.css";

const ITEMS_PER_PAGE = 10;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await getAllPayments();
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const processed = useMemo(() => {
    let result = [...payments];

    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.userName?.toLowerCase().includes(q) ||
          p.userEmail?.toLowerCase().includes(q) ||
          p.razorpayPaymentId?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [payments, search, statusFilter]);

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate totals
  const totalRevenue = payments
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Payments</h1>
          <p>Track all payment transactions</p>
        </div>
        <div className="payment-summary">
          <span className="badge badge--success">
            ₹{totalRevenue.toLocaleString("en-IN")} revenue
          </span>
          <span className="badge badge--neutral">{payments.length} transactions</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or payment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Success">Success</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="data-table-wrapper">
          <TableSkeleton rows={8} cols={7} />
        </div>
      ) : paginated.length === 0 ? (
        <EmptyState
          title="No payments found"
          message={
            search || statusFilter !== "All"
              ? "Try adjusting your search or filters"
              : "No payment records yet. Payments will appear here after successful transactions."
          }
        />
      ) : (
        <>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Payment ID</th>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((pay) => (
                  <tr key={pay._id}>
                    <td className="text-primary">{pay.userName || "—"}</td>
                    <td>{pay.userEmail || "—"}</td>
                    <td className="text-primary payment-amount">
                      ₹{(pay.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <code className="payment-id">{pay.razorpayPaymentId}</code>
                    </td>
                    <td>
                      <code className="payment-id">{pay.razorpayOrderId}</code>
                    </td>
                    <td>{formatDate(pay.createdAt)}</td>
                    <td>
                      <span
                        className={`badge ${
                          pay.status === "Success"
                            ? "badge--success"
                            : pay.status === "Pending"
                            ? "badge--warning"
                            : "badge--error"
                        }`}
                      >
                        {pay.status}
                      </span>
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

export default Payments;
