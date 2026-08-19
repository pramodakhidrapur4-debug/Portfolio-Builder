import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3000" : "https://portfolio-cs7i.onrender.com");

// ── Dashboard Stats ────────────────────────────────────────
export const getStats = () => axios.get(`${API_URL}/api/admin/stats`);

// ── Users ──────────────────────────────────────────────────
export const getAllUsers = () => axios.get(`${API_URL}/api/admin/allusers`);

// ── Payments ───────────────────────────────────────────────
export const getAllPayments = () => axios.get(`${API_URL}/api/admin/payments`);

// ── Portfolios ─────────────────────────────────────────────
export const getAllPortfolios = () => axios.get(`${API_URL}/api/admin/portfolios`);

// ── Discussions — CRUD ─────────────────────────────────────
export const getDiscussions = () => axios.get(`${API_URL}/api/admin/discussions`);
export const createDiscussion = (data) => axios.post(`${API_URL}/api/admin/discussions`, data);
export const updateDiscussion = (id, data) => axios.put(`${API_URL}/api/admin/discussions/${id}`, data);
export const deleteDiscussion = (id) => axios.delete(`${API_URL}/api/admin/discussions/${id}`);

// ── Enquiries — CRUD ──────────────────────────────────────
export const getEnquiries = () => axios.get(`${API_URL}/api/admin/enquiries`);
export const createEnquiry = (data) => axios.post(`${API_URL}/api/admin/enquiries`, data);
export const updateEnquiry = (id, data) => axios.put(`${API_URL}/api/admin/enquiries/${id}`, data);
export const deleteEnquiry = (id) => axios.delete(`${API_URL}/api/admin/enquiries/${id}`);
