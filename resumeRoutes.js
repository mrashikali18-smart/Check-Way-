import express from "express";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  uploadResume,
  listResumes,
  getResume,
  deleteResume,
  optimizeResumeBullets,
  exportResumeReport,
} from "../controllers/resumeController.js";

const router = express.Router();

router.use(protect);

router.post("/upload", upload.single("resume"), uploadResume);
router.get("/", listResumes);
router.get("/:id", getResume);
router.delete("/:id", deleteResume);
router.post("/:id/optimize-bullets", optimizeResumeBullets);
router.get("/:id/export", exportResumeReport);

export default router;
