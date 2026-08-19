import mongoose from "mongoose";

const FormSchema=new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // NEW
  template: {
    type: String,
    required: true,
  },


name:{type:String,required:true},
profession:{type:String,required:true},
projects:[{
projectName:{type:String,required:true},
projectDescription:{type:String,required:true},
projectImage:{type:String,required:true}

}],


collageName:{type:String,required:true},
degree:{type:String,required:true},
skills:{type:String,required:true},
Contact:{type:String,required:true},
profileImg:{type:String,required:true},
},

{timestamps:true}



)

const FormModel=mongoose.model("FormData",FormSchema);
export default FormModel;