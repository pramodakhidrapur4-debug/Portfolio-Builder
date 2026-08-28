import express from "express";
import { chatController } from "../Controllers/chatController.js";

const router = express.Router();

router.post("/", chatController);

export default router;