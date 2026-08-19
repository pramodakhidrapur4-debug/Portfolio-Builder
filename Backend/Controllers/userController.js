import usermod from '../models/usermodel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SEC || "random#secret");
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exist = await usermod.findOne({ email });
    if (!exist) {
      return res.json({ success: false, message: "Account not found. Please sign in first." });
    }
    if (!exist.isverify) {
      return res.json({ success: false, message: "Account not verified. Please verify your OTP." });
    }

    const match = await bcrypt.compare(password, exist.password);

    if (!match) {
      return res.json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = createToken(exist._id);
    res.json({
      success: true,
      exist,
      name: exist.name,
      email: exist.email,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

const sign = async (req, res) => {
  const { name, email, password, contact_no } = req.body;

  try {
    if (!email) {
      return res.json({ success: false, message: "Please enter an Email address" });
    }

    const user = await usermod.findOne({ email });
    if (user) {
      return res.json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const otpsen = crypto.randomInt(100000, 999999).toString();

    const newuser = new usermod({
      name: name || "User",
      email: email,
      password: hashedpassword,
      contact_no: contact_no || "",
      otp: otpsen,
      isverify: false
    });
    await newuser.save();

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      async function sendMail() {
        try {
          await transporter.sendMail({
            from: `"PORTFOLIO BUILDER" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Welcome to Portfolio Builder",
            text: `Hello, thank you for joining Portfolio Builder. YOUR OTP IS: ${otpsen}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Welcome to Portfolio Builder</h2>
                <p>Hello, thank you for joining Portfolio Builder.</p>
                <p>YOUR OTP IS: <b>${otpsen}</b></p>
              </div>
            `,
          });
        } catch (err) {
          console.error("Error sending mail:", err.message);
        }
      }

      await sendMail();
    }

    return res.json({ success: true, message: "Registration successful. Please verify your OTP." });
  } catch (error) {
    console.error("Sign error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

const verif = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await usermod.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (user.otp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP code. Please try again."
      });
    }

    user.otp = "";
    user.isverify = true;
    await user.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      name: user.name,
      email: user.email,
      message: "OTP verified successfully"
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export { login, sign, verif };