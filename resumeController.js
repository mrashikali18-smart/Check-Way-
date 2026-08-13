import Resume from "../models/Resume.js";
import { extractTextFromFile } from "../services/fileParser.js";
import { analyzeResumeText, optimizeBullets } from "../services/geminiService.js";
import { streamResumeReportPDF } from "../services/pdfReport.js";

// POST /api/resumes/upload
export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Attach a PDF or DOCX under 'resume'." });
    }

    const rawText = await extractTextFromFile(req.file.buffer, req.file.mimetype);
    const ai = await analyzeResumeText(rawText);

    const resume = await Resume.create({
      userId: req.user._id,
      fileName: req.file.originalname,
      rawText,
      parsedContent: {
        contactInfo: ai.contactInfo || {},
        skills: ai.skills || [],
        experience: ai.experience || [],
        education: ai.education || [],
      },
      atsMetrics: {
        overallScore: ai.atsScore ?? 0,
        formattingScore: ai.categoryScores?.formatting ?? 0,
        keywordDensityScore: ai.categoryScores?.keywordUsage ?? 0,
        actionVerbScore: ai.categoryScores?.impactAndMetrics ?? 0,
      },
      strengths: ai.keyStrengths || [],
      improvementAreas: ai.criticalMissingElements || ai.actionableFixes || [],
    });

    res.status(201).json({ resume });
  } catch (err) {
    next(err);
  }
};

// GET /api/resumes
export const listResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select("-rawText")
      .sort({ createdAt: -1 });
    res.json({ resumes });
  } catch (err) {
    next(err);
  }
};

// GET /api/resumes/:id
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ resume });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/resumes/:id
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.json({ message: "Resume deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/resumes/:id/export — Advanced feature: downloadable PDF ATS report
export const exportResumeReport = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    streamResumeReportPDF(resume, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/resumes/:id/optimize-bullets
export const optimizeResumeBullets = async (req, res, next) => {
  try {
    const { bullets, missingSkills = [] } = req.body;
    if (!Array.isArray(bullets) || bullets.length === 0) {
      return res.status(400).json({ message: "Provide a non-empty 'bullets' array" });
    }

    const result = await optimizeBullets(bullets, missingSkills);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
