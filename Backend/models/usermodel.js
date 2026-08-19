import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
name: {type:String,required: true},
email:{type:String,required: true},
contact_no:{type:Number,required: true},
password:{type:String,required: true},
isverify:{type:Boolean,default:false},
otp:{type:String,default:""},
data:{type:Date,default:Date.now()}
})

const usermod=mongoose.model('user',userSchema);

export default usermod;