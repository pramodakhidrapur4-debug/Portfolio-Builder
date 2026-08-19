import mongoose from "mongoose";

const googleScema=new mongoose.Schema({
    name:{type:String},
    email:{type:String},
    picture:{type:String}
})

const gogmod=mongoose.model("googleModel",googleScema);

export default gogmod;