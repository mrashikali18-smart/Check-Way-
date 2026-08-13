import Resume from "../models/Resume.js";
import JobAnalysis from "../models/JobAnalysis.js";
import { matchResumeToJob } from "../services/geminiService.js";

// POST /api/analysis/match
export const createMatch = async (req, res, next) => {
  try {
    const { resumeId, targetJobTitle, companyName, jobDescriptionText } = req.body;

    if (!resumeId || !targetJobTitle || !jobDescriptionText) {
      return res.status(400).json({
        message: "resumeId, targetJobTitle, and jobDescriptionText are required",
      });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    const ai = await matchResumeToJob(
      {
        skills: resume.parsedContent.skills,
        experience: resume.parsedContent.experience,
        education: resume.parsedContent.education,
      },
      jobDescriptionText
    );

    const analysis = await JobAnalysis.create({
      userId: req.user._id,
      resumeId: resume._id,
      targetJobTitle,
      companyName: companyName || "",
      jobDescriptionText,
      matchPercentage: ai.matchPercentage ?? 0,
      matchingSkills: ai.matchingSkills || [],
      missingSkills: ai.missingSkills || [],
      recommendedKeywords: ai.recommendedKeywords || [],
      tailoredBulletSuggestions: ai.recommendedBulletPoints || [],
    });

    res.status(201).json({ analysis });
  } catch (err) {
    next(err);
  }
};

// GET /api/analysis
export const listAnalyses = async (req, res, next) => {
  try {
    const analyses = await JobAnalysis.find({ userId: req.user._id })
      .populate("resumeId", "fileName")
      .sort({ createdAt: -1 });
    res.json({ analyses });
  } catch (err) {
    next(err);
  }
};

// GET /api/analysis/:id
export const getAnalysis = async (req, res, next) => {
  try {
    const analysis = await JobAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) return res.status(404).json({ message: "Analysis not found" });
    res.json({ analysis });
  } catch (err) {
    next(err);
  }
};

// GET /api/analysis/resume/:resumeId/history - track score improvements over time
export const getResumeHistory = async (req, res, next) => {
  try {
    const analyses = await JobAnalysis.find({
      userId: req.user._id,
      resumeId: req.params.resumeId,
    })
      .select("targetJobTitle matchPercentage createdAt")
      .sort({ createdAt: 1 });

    res.json({ history: analyses });
  } catch (err) {
    next(err);
  }
};
