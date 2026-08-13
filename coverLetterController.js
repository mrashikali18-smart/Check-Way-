import Resume from "../models/Resume.js";
import { generateCoverLetter } from "../services/geminiService.js";

// POST /api/cover-letter/generate
export const generateLetter = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, companyName, jobDescriptionText } = req.body;

    if (!resumeId || !jobTitle || !jobDescriptionText) {
      return res.status(400).json({
        message: "resumeId, jobTitle, and jobDescriptionText are required",
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const result = await generateCoverLetter({
      parsedResume: resume.parsedContent,
      jobTitle,
      companyName,
      jobDescriptionText,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};
