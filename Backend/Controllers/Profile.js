import usermod from "../models/usermodel.js";
import googmod from "../models/GoogleLog.js";
import FormModel from "../models/Formmodel.js";
const prof = async (req, res) => {
  try {
    let user = await usermod.findById(req.userId).select("-password -otp");

    if (!user) {
      user = await googmod.findById(req.userId);
    }

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const proj = async (req, res) => {
  try {
    const portfolios = await FormModel.find({
      userId: req.userId,
    });

    if (portfolios.length === 0) {
      return res.json({
        success: false,
        message: "No portfolios found",
      });
    }

    return res.json({
      success: true,
      portfolios,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



export { prof,proj };