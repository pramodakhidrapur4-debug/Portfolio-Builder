import "dotenv/config";
import Razorpay from "razorpay";
import crypto from "crypto";
import PaymentModel from "../models/Payment.js";
import usermod from "../models/usermodel.js";
import gogmod from "../models/GoogleLog.js";

const instance = new Razorpay({
  key_id: process.env.Razor_key || "",
  key_secret: process.env.Razor_Sec || "",
});

const key = async (req, res) => {
  return res.json({
    key: process.env.Razor_key || "",
  });
};

const CreateOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: (amount || 499) * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json(order);
  } catch (err) {
    console.error("CreateOrder Error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.Razor_Sec || "")
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      let amount = req.body.amount;
      let userName = req.body.userName || "";
      let userEmail = req.body.userEmail || "";
      let userId = req.body.userId || req.userId || null;

      // Try fetching details from Razorpay API
      if (process.env.Razor_key) {
        try {
          const rzpPay = await instance.payments.fetch(razorpay_payment_id);
          if (rzpPay) {
            if (!amount && rzpPay.amount) amount = rzpPay.amount / 100;
            if (!userEmail && rzpPay.email) userEmail = rzpPay.email;
          }
        } catch (e) {
          console.error("Razorpay fetch error:", e.message);
        }
      }

      // If userEmail is available, attempt to find user in database
      if (userEmail && (!userName || !userId)) {
        const u1 = await usermod.findOne({ email: userEmail });
        if (u1) {
          if (!userName) userName = u1.name;
          if (!userId) userId = u1._id;
        } else {
          const u2 = await gogmod.findOne({ email: userEmail });
          if (u2) {
            if (!userName) userName = u2.name;
            if (!userId) userId = u2._id;
          }
        }
      }

      // If user is still missing name, look up latest registered user as fallback
      if (!userName || userName === "") {
        const latestNormal = await usermod.findOne().sort({ _id: -1 });
        if (latestNormal) {
          userName = latestNormal.name;
          userEmail = latestNormal.email;
          userId = latestNormal._id;
        }
      }

      // Save successful payment to database
      try {
        await PaymentModel.create({
          userId: userId || null,
          userName: userName || "Paid User",
          userEmail: userEmail || "—",
          amount: amount || 499,
          razorpayPaymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          status: "Success",
        });
      } catch (saveErr) {
        console.error("Payment DB save log error:", saveErr.message);
      }

      return res.status(200).json({
        success: true,
        message: "Payment Verified Successfully",
        paymentId: razorpay_payment_id,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid Signature",
    });
  } catch (err) {
    console.error("verifyPayment Error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { key, verifyPayment, CreateOrder };