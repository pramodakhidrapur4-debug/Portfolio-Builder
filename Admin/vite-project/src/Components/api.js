import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-cs7i.onrender.com";

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("adminAuth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token; // Fallback
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      sessionStorage.removeItem("adminAuth");
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const adminLogin = (data) => api.post(`/api/user/login`, data);

// ── Dashboard Stats ────────────────────────────────────────
export const getStats = () => api.get(`/api/admin/stats`);

// ── Users ──────────────────────────────────────────────────
export const getAllUsers = () => api.get(`/api/admin/allusers`);

// ── Payments ───────────────────────────────────────────────
export const getAllPayments = () => api.get(`/api/admin/payments`);

// ── Portfolios ─────────────────────────────────────────────
export const getAllPortfolios = () => api.get(`/api/admin/portfolios`);

// ── Discussions — CRUD ─────────────────────────────────────
export const getDiscussions = () => api.get(`/api/admin/discussions`);
export const createDiscussion = (data) => api.post(`/api/admin/discussions`, data);
export const updateDiscussion = (id, data) => api.put(`/api/admin/discussions/${id}`, data);
export const deleteDiscussion = (id) => api.delete(`/api/admin/discussions/${id}`);

// ── Enquiries — CRUD ──────────────────────────────────────
export const getEnquiries = () => api.get(`/api/business-enquiries`);
export const createEnquiry = (data) => api.post(`/api/business-enquiries`, data);
export const updateEnquiry = (id, data) => api.patch(`/api/business-enquiries/${id}/status`, data);
export const deleteEnquiry = (id) => api.delete(`/api/business-enquiries/${id}`);

// ── Previous Works ────────────────────────────────────────
export const getPreviousWorksAdmin = () => api.get(`/api/works`);
export const createPreviousWork = (data) => api.post(`/api/works`, data);
export const updatePreviousWork = (id, data) => api.put(`/api/works/${id}`, data);
export const deletePreviousWork = (id) => api.delete(`/api/works/${id}`);
