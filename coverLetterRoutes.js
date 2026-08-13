import express from "express";
import { protect } from "../middleware/auth.js";
import { generateLetter } from "../controllers/coverLetterController.js";

const router = express.Router();

router.post("/generate", protect, generateLetter);

export default router;
