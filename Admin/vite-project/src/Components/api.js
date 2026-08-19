import axios from "axios";

// ── Axios Instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://portfolio-cs7i.onrender.com"}/api/admin`,
});

// ── Dashboard Stats ────────────────────────────────────────
export const getStats = () => api.get("/stats");

// ── Users ──────────────────────────────────────────────────
export const getAllUsers = () => api.get("/allusers");

// ── Payments ───────────────────────────────────────────────
export const getAllPayments = () => api.get("/payments");

// ── Portfolios ─────────────────────────────────────────────
export const getAllPortfolios = () => api.get("/portfolios");

// ── Discussions — CRUD ─────────────────────────────────────
export const getDiscussions = () => api.get("/discussions");
export const createDiscussion = (data) => api.post("/discussions", data);
export const updateDiscussion = (id, data) => api.put(`/discussions/${id}`, data);
export const deleteDiscussion = (id) => api.delete(`/discussions/${id}`);

// ── Enquiries — CRUD ──────────────────────────────────────
export const getEnquiries = () => api.get("/enquiries");
export const createEnquiry = (data) => api.post("/enquiries", data);
export const updateEnquiry = (id, data) => api.put(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);

export default api;
