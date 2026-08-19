import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SEC,
});

console.log(cloudinary.config());

try {
  const result = await cloudinary.api.ping();
  console.log(result);
} catch (err) {
  console.log(err);
}