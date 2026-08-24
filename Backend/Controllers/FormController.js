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

    if (!profileResult?.secure_url) {
      throw new Error("Profile image uploaded but Cloudinary returned no secure URL");
    }
    profileImg = profileResult.secure_url;
    console.log("6. Profile image processing complete");

    console.log("7. Starting project image processing");
    const projectFiles = req.files?.projectImages || [];
    const uploadedProjectImages = [];

    for (const file of projectFiles) {
      console.log("Uploading project image:", file.path);

      const result = await upl(file.path);

      if (!result?.secure_url) {
        throw new Error("A project image failed to upload");
      }

      uploadedProjectImages.push(result.secure_url);
    }
    console.log("8. Project image processing complete");

    console.log("9. Parsing projects");
    const projects = JSON.parse(req.body.projects || "[]");

    const finalProjects = projects.map((project, index) => ({
      projectName: project.projectName || "",
      projectDescription: project.projectDescription || "",
      projectImage: uploadedProjectImages[index] || ""
    }));

    for (const project of finalProjects) {
      if (!project.projectName) {
        throw new Error("Project name is required");
      }

      if (!project.projectDescription) {
        throw new Error("Project description is required");
      }

      if (!project.projectImage) {
        throw new Error("Project image is required");
      }
    }
    console.log("10. Projects parsed successfully");

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