import FormModel from "../models/Formmodel.js";
import { upl } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const FormInfo = async (req, res) => {
  try {
    const {
      name,
      profession,
      collageName,
      degree,
      skills,
      Contact,
    } = req.body;

    let projects = [];
    if (req.body.projects) {
      try {
        projects = typeof req.body.projects === "string" ? JSON.parse(req.body.projects) : req.body.projects;
      } catch (e) {
        projects = [];
      }
    }

    let profileImg = "";
    if (req.files && req.files.profileImg && req.files.profileImg[0]) {
      const result = await upl(req.files.profileImg[0].path);
      if (result && result.secure_url) {
        profileImg = result.secure_url;
      }
    }

    if (req.files && req.files.projectImages) {
      for (let i = 0; i < projects.length; i++) {
        if (req.files.projectImages[i]) {
          const imageResult = await upl(req.files.projectImages[i].path);
          if (imageResult && imageResult.secure_url) {
            projects[i].projectImage = imageResult.secure_url;
          }
        }
      }
    }

    const newform = new FormModel({
      userId: req.userId,
      template: req.body.template || "Standard",
      name: name || "",
      profession: profession || "",
      projects: projects,
      collageName: collageName || "",
      degree: degree || "",
      skills: skills || "",
      Contact: Contact || "",
      profileImg: profileImg || "",
    });

    const savedForm = await newform.save();
    return res.json({
      success: true,
      name,
      userId: req.userId,
      template: req.body.template,
      profession,
      projects,
      collageName,
      degree,
      skills,
      Contact,
      profileImg,
      message: "Form data saved successfully",
      id: savedForm._id,
    });
  } catch (error) {
    console.error("FormInfo error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const fetdata = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing portfolio ID" });
    }
    const data = await FormModel.findById(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Portfolio not found" });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { FormInfo, fetdata };