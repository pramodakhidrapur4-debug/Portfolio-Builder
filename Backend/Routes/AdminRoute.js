import {
  getDashboardStats,
  getAllUsers,
  getAllPayments,
  getAllPortfolios,
  getDiscussions,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  getEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
} from "../Controllers/AdminController.js";
import express from "express";
import authmid from "../Middleware/Auth.js";

const roog = express.Router();

// Apply auth middleware to all admin routes
roog.use(authmid);

// Dashboard stats
roog.get("/stats", getDashboardStats);

// Users
roog.get("/allusers", getAllUsers);

// Payments
roog.get("/payments", getAllPayments);

// Portfolios
roog.get("/portfolios", getAllPortfolios);

// Discussions — CRUD
roog.get("/discussions", getDiscussions);
roog.post("/discussions", createDiscussion);
roog.put("/discussions/:id", updateDiscussion);
roog.delete("/discussions/:id", deleteDiscussion);

// Enquiries — CRUD
roog.get("/enquiries", getEnquiries);
roog.post("/enquiries", createEnquiry);
roog.put("/enquiries/:id", updateEnquiry);
roog.delete("/enquiries/:id", deleteEnquiry);

export { roog };