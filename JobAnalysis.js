import mongoose from "mongoose";

const jobAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true, index: true },
    targetJobTitle: { type: String, required: true },
    companyName: { type: String, default: "" },
    jobDescriptionText: { type: String, required: true },
    matchPercentage: { type: Number, min: 0, max: 100, default: 0 },
    matchingSkills: [String],
    missingSkills: [String],
    recommendedKeywords: [String],
    tailoredBulletSuggestions: [String],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("JobAnalysis", jobAnalysisSchema);
