import { useState, useEffect } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import {
  getDiscussions,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
} from "../api";
import { TableSkeleton } from "../UI/Skeleton";
import EmptyState from "../UI/EmptyState";
import Modal from "../UI/Modal";
import { useToast } from "../UI/Toast";
import "./Discussions.css";

const STATUS_OPTIONS = [
  "Pending",
  "In Discussion",
  "Development",
  "Completed",
  "Cancelled",
];

const STATUS_BADGE = {
  Pending: "badge--warning",
  "In Discussion": "badge--info",
  Development: "badge--purple",
  Completed: "badge--success",
  Cancelled: "badge--error",
};

const EMPTY_FORM = {
  clientName: "",
  email: "",
  phone: "",
  projectTitle: "",
  budget: "",
  notes: "",
  deadline: "",
  status: "Pending",
};

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [expandedNotes, setExpandedNotes] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDiscussions();
      if (res.data.success) setDiscussions(res.data.discussions);
    } catch {
      toast.error("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  // ── Form handlers ─────────────────────────────────────────
  const openCreateForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (disc) => {
    setForm({
      clientName: disc.clientName,
      email: disc.email,
      phone: disc.phone || "",
      projectTitle: disc.projectTitle,
      budget: disc.budget || "",
      notes: disc.notes || "",
      deadline: disc.deadline ? disc.deadline.split("T")[0] : "",
      status: disc.status,
    });
    setEditingId(disc._id);
    setFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.email.trim() || !form.projectTitle.trim()) {
      toast.warning("Please fill required fields");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await updateDiscussion(editingId, form);
        if (res.data.success) {
          setDiscussions((prev) =>
            prev.map((d) => (d._id === editingId ? res.data.discussion : d))
          );
          toast.success("Discussion updated");
        }
      } else {
        const res = await createDiscussion(form);
        if (res.data.success) {
          setDiscussions((prev) => [res.data.discussion, ...prev]);
          toast.success("Discussion created");
        }
      }
      setFormOpen(false);
    } catch {
      toast.error("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Inline status update ──────────────────────────────────
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateDiscussion(id, { status: newStatus });
      if (res.data.success) {
        setDiscussions((prev) =>
          prev.map((d) => (d._id === id ? { ...d, status: newStatus } : d))
        );
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async () => {
    try {
      await deleteDiscussion(deleteModal.id);
      setDiscussions((prev) => prev.filter((d) => d._id !== deleteModal.id));
      toast.success("Discussion deleted");
    } catch {
      toast.error("Delete failed");
    }
    setDeleteModal({ open: false, id: null });
  };

  // ── Filtering ─────────────────────────────────────────────
  const filtered = discussions.filter((d) => {
    const matchStatus = statusFilter === "All" || d.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.clientName?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.projectTitle?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

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
          <h1>Customer Discussions</h1>
          <p>Manage client projects and track their status</p>
        </div>
        <button className="btn btn--primary" onClick={openCreateForm}>
          <HiPlus /> New Discussion
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, email, or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
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
          <TableSkeleton rows={6} cols={7} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No discussions found"
          message="Create your first client discussion to get started"
          actionLabel="Add Discussion"
          onAction={openCreateForm}
        />
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Project</th>
                <th>Budget</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d._id}>
                  <td>
                    <div>
                      <span className="disc-client-name">{d.clientName}</span>
                      <span className="disc-client-email">{d.email}</span>
                      {d.phone && (
                        <span className="disc-client-phone">{d.phone}</span>
                      )}
                    </div>
                  </td>
                  <td className="text-primary">{d.projectTitle}</td>
                  <td>{d.budget || "—"}</td>
                  <td>{formatDate(d.deadline)}</td>
                  <td>
                    <select
                      className={`status-select ${STATUS_BADGE[d.status] || ""}`}
                      value={d.status}
                      onChange={(e) => handleStatusChange(d._id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {d.notes ? (
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() =>
                          setExpandedNotes(
                            expandedNotes === d._id ? null : d._id
                          )
                        }
                      >
                        {expandedNotes === d._id ? <HiChevronUp /> : <HiChevronDown />}
                        {expandedNotes === d._id ? "Hide" : "View"}
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <div className="disc-actions">
                      <button
                        className="btn btn--ghost btn--icon"
                        onClick={() => openEditForm(d)}
                        title="Edit"
                      >
                        <HiPencil />
                      </button>
                      <button
                        className="btn btn--ghost btn--icon disc-delete-btn"
                        onClick={() => setDeleteModal({ open: true, id: d._id })}
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

          {/* Expanded notes - shown below table as an overlay note */}
          {expandedNotes && (
            <div className="disc-notes-panel">
              <strong>Notes:</strong>
              <p>
                {discussions.find((d) => d._id === expandedNotes)?.notes || "—"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Create/Edit Modal ──────────────────────────────── */}
      <Modal isOpen={formOpen} onCancel={() => setFormOpen(false)}>
        <h3 className="modal-form-title">
          {editingId ? "Edit Discussion" : "New Discussion"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Client Name *</label>
              <input
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
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
                placeholder="client@email.com"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label>Project Title *</label>
              <input
                type="text"
                value={form.projectTitle}
                onChange={(e) =>
                  setForm({ ...form, projectTitle: e.target.value })
                }
                placeholder="Project name"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Budget</label>
              <input
                type="text"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="e.g. ₹50,000"
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes..."
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
              {saving ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation ────────────────────────────── */}
      <Modal
        isOpen={deleteModal.open}
        title="Delete Discussion"
        message="Are you sure you want to delete this discussion? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
};

export default Discussions;
