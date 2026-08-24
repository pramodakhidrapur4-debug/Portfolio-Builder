import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SEC,
});

const upl = async (filePath) => {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "portfolio-builder",
      resource_type: "auto",
      timeout: 60000 // 60 seconds timeout
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return null;
  }
};

export { upl };