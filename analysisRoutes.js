import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createMatch,
  listAnalyses,
  getAnalysis,
  getResumeHistory,
} from "../controllers/analysisController.js";

const router = express.Router();

router.use(protect);

router.post("/match", createMatch);
router.get("/", listAnalyses);
router.get("/:id", getAnalysis);
router.get("/resume/:resumeId/history", getResumeHistory);

export default router;
