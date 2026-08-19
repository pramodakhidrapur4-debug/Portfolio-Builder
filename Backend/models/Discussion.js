import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    projectTitle: { type: String, required: true },
    budget: { type: String, default: "" },
    notes: { type: String, default: "" },
    deadline: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Pending", "In Discussion", "Development", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const DiscussionModel = mongoose.model("Discussion", DiscussionSchema);
export default DiscussionModel;
