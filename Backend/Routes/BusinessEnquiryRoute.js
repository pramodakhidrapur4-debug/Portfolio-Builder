import express from "express";
import {
  createBusinessEnquiry,
  getBusinessEnquiries,
  getBusinessEnquiryById,
  updateBusinessEnquiryStatus,
  deleteBusinessEnquiry
} from "../Controllers/BusinessEnquiryController.js";
import adminAuth from "../Middleware/AdminAuth.js";
import authmid from "../Middleware/Auth.js";

const router = express.Router();

// ───────────────────────────────────────────
// PUBLIC ROUTE
// ───────────────────────────────────────────
// Anyone can submit a business enquiry
router.post("/", createBusinessEnquiry);

// ───────────────────────────────────────────
// ADMIN ROUTES (Protected)
// ───────────────────────────────────────────
router.use(authmid);
// router.use(adminAuth); // Removed to use the same session validation as Dashboard

router.get("/", getBusinessEnquiries);
router.get("/:id", getBusinessEnquiryById);
router.patch("/:id/status", updateBusinessEnquiryStatus);
router.delete("/:id", deleteBusinessEnquiry);

export default router;
