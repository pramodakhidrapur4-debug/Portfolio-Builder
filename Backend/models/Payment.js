import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    razorpayPaymentId: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    status: {
      type: String,
      enum: ["Success", "Failed", "Pending"],
      default: "Success",
    },
  },
  { timestamps: true }
);

const PaymentModel = mongoose.model("Payment", PaymentSchema);
export default PaymentModel;
