import BusinessEnquiryModel from "../models/BusinessEnquiry.js";

// ───────────────────────────────────────────
// PUBLIC: Create Business Enquiry
// ───────────────────────────────────────────
export const createBusinessEnquiry = async (req, res) => {
  try {
    const { name, email, phone, businessName, message } = req.body;
    
    if (!name || !email || !phone || !businessName || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const enquiry = new BusinessEnquiryModel({
      name,
      email,
      phone,
      businessName,
      message,
      status: "Pending" // Default
    });

    await enquiry.save();
    res.status(201).json({ success: true, enquiry, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("createBusinessEnquiry error:", error.message);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

// ───────────────────────────────────────────
// ADMIN: Get All Business Enquiries
// ───────────────────────────────────────────
export const getBusinessEnquiries = async (req, res) => {
  try {
    const enquiries = await BusinessEnquiryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, enquiries });
  } catch (error) {
    console.error("getBusinessEnquiries error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch enquiries" });
  }
};

// ───────────────────────────────────────────
// ADMIN: Get Enquiry by ID
// ───────────────────────────────────────────
export const getBusinessEnquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await BusinessEnquiryModel.findById(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, enquiry });
  } catch (error) {
    console.error("getBusinessEnquiryById error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ───────────────────────────────────────────
// ADMIN: Update Status
// ───────────────────────────────────────────
export const updateBusinessEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "On Going", "Completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const enquiry = await BusinessEnquiryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }

    res.status(200).json({ success: true, enquiry, message: "Status updated successfully" });
  } catch (error) {
    console.error("updateBusinessEnquiryStatus error:", error.message);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

// ───────────────────────────────────────────
// ADMIN: Delete Enquiry
// ───────────────────────────────────────────
export const deleteBusinessEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await BusinessEnquiryModel.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("deleteBusinessEnquiry error:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete enquiry" });
  }
};
