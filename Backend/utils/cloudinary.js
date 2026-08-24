import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

console.log("========== CLOUDINARY CONFIG CHECK ==========");
console.log("CLOUD_NAME exists:", !!process.env.CLOUD_NAME);
console.log("CLOUD_API exists:", !!process.env.CLOUD_API);
console.log("CLOUD_SEC exists:", !!process.env.CLOUD_SEC);
console.log("=============================================");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SEC,
});

const upl = async (filePath) => {
  console.log("========== CLOUDINARY UPLOAD START ==========");
  console.log("File path:", filePath);
  console.log("File exists:", !!filePath && fs.existsSync(filePath));

  if (!filePath) {
    throw new Error("Cloudinary upload failed: file path is missing");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Cloudinary upload failed: temporary file does not exist: ${filePath}`
    );
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "portfolio-builder",
      resource_type: "auto",
    });

    console.log("Cloudinary upload successful:", result.secure_url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;

  } catch (error) {
    console.error("========== CLOUDINARY UPLOAD ERROR ==========");
    console.error("Message:", error.message);
    console.error("Name:", error.name);
    console.error("HTTP Code:", error.http_code);
    console.error("Full error:", error);
    console.error("=============================================");

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Temporary file cleanup error:", cleanupError.message);
      }
    }

    throw error;
  }
};

export { upl };