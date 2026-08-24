import FormModel from "../models/Formmodel.js";
import { upl } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const FormInfo = async (req, res, next) => {
  try {
    console.log("========== FORM REQUEST START ==========");
    console.log("1. Authenticated user:", req.user || req.userId);
    console.log("2. Request body:", req.body);
    console.log("3. Request file:", req.file);
    console.log("4. Request files:", req.files);

    const {
      name,
      profession,
      collageName,
      degree,
      skills,
      Contact,
    } = req.body;

    console.log("5. Starting profile image processing");
    const profileFile = req.files?.profileImg?.[0];
    if (!profileFile) {
      return res.status(400).json({
        success: false,
        message: "Profile image was not received by the server"
      });
    }

    let profileImg = "";
    const profileResult = await upl(profileFile.path);
    if (profileResult && profileResult.secure_url) {
      profileImg = profileResult.secure_url;
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to upload profile image to Cloudinary"
      });
    }
    console.log("6. Profile image processing complete");

    console.log("7. Starting project image processing");
    const projectFiles = req.files?.projectImages || [];
    const uploadedProjectImages = [];
    for (const file of projectFiles) {
      const result = await upl(file.path);
      if (result && result.secure_url) {
        uploadedProjectImages.push(result.secure_url);
      } else {
        uploadedProjectImages.push("");
      }
    }
    console.log("8. Project image processing complete");

    console.log("9. Parsing projects");
    let projects = [];
    if (req.body.projects) {
      try {
        projects = typeof req.body.projects === "string" ? JSON.parse(req.body.projects) : req.body.projects;
      } catch (e) {
        console.error("Failed to parse projects:", e);
        projects = [];
      }
    }
    console.log("10. Projects parsed successfully");

    const finalProjects = projects.map((project, index) => ({
      ...project,
      projectImage: uploadedProjectImages[index] || ""
    }));

    console.log("11. Creating MongoDB document");
    const formData = new FormModel({
      userId: req.user || req.userId,
      template: req.body.template || "Standard",
      name: name || "",
      profession: profession || "",
      projects: finalProjects,
      collageName: collageName || "",
      degree: degree || "",
      skills: skills || "",
      Contact: Contact || "",
      profileImg: profileImg || "",
    });

    console.log("12. Saving MongoDB document");
    const savedData = await formData.save();
    console.log("13. MongoDB saved successfully:", savedData._id);
    console.log("========== FORM REQUEST SUCCESS ==========");

    return res.status(201).json({
      success: true,
      data: savedData
    });
  } catch (error) {
    console.error("========== PORTFOLIO FILL ERROR ==========");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("Stack:", error.stack);
    console.error("Code:", error.code);
    console.error("Errors:", error.errors);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
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