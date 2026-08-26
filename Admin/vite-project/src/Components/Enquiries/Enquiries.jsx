import { useState, useEffect } from "react";
import { HiPlus, HiTrash, HiPhone, HiMail, HiInformationCircle } from "react-icons/hi";
import {
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from "../api";
import { TableSkeleton } from "../UI/Skeleton";
import EmptyState from "../UI/EmptyState";
import Modal from "../UI/Modal";
import { useToast } from "../UI/Toast";
import "./Enquiries.css";

const STATUS_OPTIONS = ["Pending", "On Going", "Completed"];

const STATUS_BADGE = {
  Pending: "badge--warning",
  "On Going": "badge--info",
  Completed: "badge--success",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  message: "",
  status: "Pending",
};

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [expandedMsg, setExpandedMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getEnquiries();
      if (res.data && res.data.success) {
        setEnquiries(res.data.enquiries || []);
      }
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.warning("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      const res = await createEnquiry(form);
      if (res.data && res.data.success) {
        setEnquiries((prev) => [res.data.enquiry, ...prev]);
        toast.success("Enquiry added");
        setFormOpen(false);
        setForm({ ...EMPTY_FORM });
      }
    } catch {
      toast.error("Failed to add enquiry");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await updateEnquiry(id, { status: newStatus });
      if (res.data && res.data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEnquiry(deleteModal.id);
      setEnquiries((prev) => prev.filter((e) => e._id !== deleteModal.id));
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Delete failed");
    }
    setDeleteModal({ open: false, id: null });
  };

  const filtered = enquiries.filter((e) => {
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.name?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Recent Enquiries</h1>
          <p>Consultation requests, contact messages, and prospective client leads</p>
        </div>
        <button className="btn btn--primary" onClick={() => setFormOpen(true)}>
          <HiPlus /> Add Enquiry
        </button>
      </div>

      {/* Info Notice explaining what Enquiry section is */}
      <div className="enquiry-info-banner">
        <HiInformationCircle className="enquiry-info-icon" />
        <div>
          <strong>What is the Business Enquiry Section?</strong>
          <span>
            This section stores consultation requests and business requirements submitted from the Business Page. Use the quick buttons below to change status between <em>Pending</em>, <em>On Going</em>, and <em>Completed</em>.
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status ({enquiries.length})</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="data-table-wrapper">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No enquiries found"
          message="Consultation requests and contact inquiries will appear here"
          actionLabel="Add New Enquiry"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Business Name</th>
                <th>Contact Info</th>
                <th>Requirements / Message</th>
                <th>Received Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enq) => (
                <tr key={enq._id}>
                  <td className="text-primary">{enq.name}</td>
                  <td>{enq.businessName || "—"}</td>
                  <td>
                    <div className="enq-contact">
                      <span>
                        <HiMail className="enq-contact-icon" /> {enq.email}
                      </span>
                      {enq.phone && (
                        <span>
                          <HiPhone className="enq-contact-icon" /> {enq.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    {enq.message ? (
                      <div className="enq-message">
                        <span className="enq-message-text">
                          {expandedMsg === enq._id
                            ? enq.message
                            : enq.message.slice(0, 60) +
                              (enq.message.length > 60 ? "..." : "")}
                        </span>
                        {enq.message.length > 60 && (
                          <button
                            className="btn btn--ghost btn--sm enq-expand-btn"
                            onClick={() =>
                              setExpandedMsg(
                                expandedMsg === enq._id ? null : enq._id
                              )
                            }
                          >
                            {expandedMsg === enq._id ? "Less" : "More"}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{formatDate(enq.createdAt)}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[enq.status] || "badge--warning"}`}>
                      {enq.status}
                    </span>
                  </td>
                  <td>
                    <div className="enq-actions">
                      {enq.status !== "On Going" && (
                        <button
                          className="btn btn--sm enq-action-btn enq-action-btn--contacted"
                          onClick={() => handleStatusUpdate(enq._id, "On Going")}
                        >
                          Mark On Going
                        </button>
                      )}
                      {enq.status !== "Pending" && (
                        <button
                          className="btn btn--sm enq-action-btn enq-action-btn--pending"
                          onClick={() => handleStatusUpdate(enq._id, "Pending")}
                        >
                          Mark Pending
                        </button>
                      )}
                      {enq.status !== "Completed" && (
                        <button
                          className="btn btn--sm enq-action-btn enq-action-btn--completed"
                          onClick={() => handleStatusUpdate(enq._id, "Completed")}
                        >
                          Mark Completed
                        </button>
                      )}
                      <button
                        className="btn btn--ghost btn--icon disc-delete-btn"
                        onClick={() =>
                          setDeleteModal({ open: true, id: enq._id })
                        }
                        title="Delete"
                      >
                        <HiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create Enquiry Modal ───────────────────────────── */}
      <Modal isOpen={formOpen} onCancel={() => setFormOpen(false)}>
        <h3 className="modal-form-title">Add New Consultation Enquiry</h3>
        <form onSubmit={handleCreateSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Client name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Business Name</label>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              placeholder="Business name"
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>
          <div className="form-group">
            <label>Inquiry Details / Message</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Project requirements or contact note..."
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Saving..." : "Add Enquiry"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation ────────────────────────────── */}
      <Modal
        isOpen={deleteModal.open}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
};

export default Enquiries;
