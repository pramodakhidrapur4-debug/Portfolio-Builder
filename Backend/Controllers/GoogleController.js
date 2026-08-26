import googmod from '../models/GoogleLog.js'
import axios from 'axios'
import { OAuth2Client } from '../utils/GoogleConfig.js'
import jwt from "jsonwebtoken";
const googleLogin=async(req,res)=>{
try {
    const {code}=req.query
    const googleRespon=await OAuth2Client.getToken(code);
    
    // Do NOT call OAuth2Client.setCredentials(googleRespon.tokens) as it is a global singleton
    // Pass the token directly to axios instead
    const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRespon.tokens.access_token}`)

    const {name,email,picture}=userRes.data;

    // Atomic find or create (prevents race conditions if clicked multiple times)
    const user = await googmod.findOneAndUpdate(
        { email },
        { $setOnInsert: { name, email, picture } },
        { upsert: true, new: true }
    );

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SEC
    );

    return res.json({
        success: true,  
        user: {
            name,
            email,
            picture,
        },
        token
    });
} catch (error) {
    console.error("Google Auth Error:", error.response?.data || error.message);
    const status = error.response?.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Failed to authenticate with Google",
    });
}
}

export  {googleLogin}