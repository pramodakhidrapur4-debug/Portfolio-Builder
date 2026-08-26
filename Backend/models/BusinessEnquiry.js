import mongoose from "mongoose";

const BusinessEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Pending", "On Going", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const BusinessEnquiryModel = mongoose.model("BusinessEnquiry", BusinessEnquirySchema);
export default BusinessEnquiryModel;
