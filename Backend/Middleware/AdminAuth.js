import usermod from '../models/usermodel.js';
import dotenv from 'dotenv';
dotenv.config();

const adminAuth = async (req, res, next) => {
  try {
    const user = await usermod.findById(req.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!process.env.ADMIN_EMAIL) {
      console.warn("ADMIN_EMAIL not set in environment. Falling back to deny all.");
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    if (user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    next();
  } catch (error) {
    console.error("AdminAuth error:", error.message);
    return res.status(500).json({ success: false, message: 'Server error during authorization' });
  }
};

export default adminAuth;
