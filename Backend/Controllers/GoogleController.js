import googmod from '../models/GoogleLog.js'
import axios from 'axios'
import { OAuth2Client } from '../utils/GoogleConfig.js'
import jwt from "jsonwebtoken";
const googleLogin=async(req,res)=>{
try {
    const {code}=req.query
const googleRespon=await OAuth2Client.getToken(code);
OAuth2Client.setCredentials(googleRespon.tokens);

const userRes=await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRespon.tokens.access_token}`)


const {name,email,picture}=userRes.data;

let user=await googmod.findOne({email});

if(!user){
 user=await googmod.create({
    name:name,
    email:email,
    picture:picture
})
}

const token = jwt.sign(
  {
    id: user._id,
    email: user.email,
  },
  process.env.JWT_SEC
);
return res.json({success: true,  user: {
    name,
    email,
    picture,
  },token});
} catch (error) {
return res.json({
  success: false,
  message: error.message,
});
}
}

export  {googleLogin}