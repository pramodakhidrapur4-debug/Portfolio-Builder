import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const EnquiryModel = mongoose.model("Enquiry", EnquirySchema);
export default EnquiryModel;
