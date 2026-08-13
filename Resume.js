import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    duration: String,
    highlights: [String],
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    parsedContent: {
      contactInfo: {
        email: String,
        phone: String,
        linkedin: String,
      },
      skills: [String],
      experience: [experienceSchema],
      education: [String],
    },
    atsMetrics: {
      overallScore: { type: Number, min: 0, max: 100, default: 0 },
      formattingScore: { type: Number, min: 0, max: 100, default: 0 },
      keywordDensityScore: { type: Number, min: 0, max: 100, default: 0 },
      actionVerbScore: { type: Number, min: 0, max: 100, default: 0 },
    },
    strengths: [String],
    improvementAreas: [String],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } }
);

export default mongoose.model("Resume", resumeSchema);
