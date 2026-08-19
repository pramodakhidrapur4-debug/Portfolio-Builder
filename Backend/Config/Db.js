import mongoose from "mongoose";

export const Mongo = async () => {
  try {
    await mongoose.connect(process.env.db_url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};