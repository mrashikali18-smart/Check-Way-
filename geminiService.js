import { GoogleGenAI } from "@google/genai";

let client = null;

const getClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the server");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};

const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.0-flash";

/**
 * Calls Gemini with a prompt and parses the response as strict JSON.
 * Strips markdown code fences defensively in case the model wraps the reply.
 */
const generateJSON = async (prompt) => {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL(),
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });

  const text = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("AI returned a response that could not be parsed as JSON");
  }
};

/**
 * Workflow 1: Resume parsing, ATS scoring, and diagnostic breakdown.
 */
export const analyzeResumeText = async (rawText) => {
  const prompt = `You are an expert HR recruiter and ATS (Applicant Tracking System) algorithm evaluator.
Analyze the following resume text and provide a structured JSON response.

Strict JSON Output Schema (respond with ONLY this JSON, no preamble or markdown):
{
  "atsScore": number (0 to 100),
  "skills": string[],
  "categoryScores": {
    "formatting": number (0 to 100),
    "keywordUsage": number (0 to 100),
    "impactAndMetrics": number (0 to 100)
  },
  "contactInfo": { "email": string, "phone": string, "linkedin": string },
  "experience": [ { "title": string, "company": string, "duration": string, "highlights": string[] } ],
  "education": string[],
  "keyStrengths": string[],
  "criticalMissingElements": string[],
  "actionableFixes": string[]
}

Resume Text:
${rawText}`;

  return generateJSON(prompt);
};

/**
 * Workflow 2: Job description matching and skill-gap analysis.
 */
export const matchResumeToJob = async (parsedResumeJson, jobDescriptionText) => {
  const prompt = `Compare the candidate's parsed resume with the provided target job description.
Return ONLY JSON (no preamble or markdown) containing:
{
  "matchPercentage": number (0-100, based on role qualification fit),
  "matchingSkills": string[] (skills found in both resume and job),
  "missingSkills": string[] (critical skills required by job but absent in resume),
  "recommendedKeywords": string[] (keywords to weave into the resume),
  "recommendedBulletPoints": string[] (3 rewritten impact bullets incorporating missing skills)
}

Resume Summary:
${JSON.stringify(parsedResumeJson)}

Target Job Description:
${jobDescriptionText}`;

  return generateJSON(prompt);
};

/**
 * AI Resume Bullet Optimizer - standalone bullet rewriting.
 */
export const optimizeBullets = async (bullets, missingSkills) => {
  const prompt = `You are a resume writing expert. Rewrite the following bullet points to be more
impactful, quantified, and to naturally incorporate the missing skills/keywords listed below where truthful and relevant.
Do not fabricate metrics; use placeholder brackets like [X%] when a number is implied but unknown.

Return ONLY JSON:
{
  "optimizedBullets": [ { "original": string, "rewritten": string } ]
}

Original Bullets:
${JSON.stringify(bullets)}

Missing Skills/Keywords to incorporate where relevant:
${JSON.stringify(missingSkills)}`;

  return generateJSON(prompt);
};

/**
 * One-click AI Cover Letter Generator (Phase 4 feature).
 */
export const generateCoverLetter = async ({ parsedResume, jobTitle, companyName, jobDescriptionText }) => {
  const prompt = `Write a tailored, professional, and concise (under 350 words) cover letter for the candidate
below, applying to the role of "${jobTitle}" at "${companyName || "the company"}".
Use the candidate's real experience and skills. Do not fabricate accomplishments. Keep tone confident but natural.

Return ONLY JSON:
{
  "coverLetter": string
}

Candidate Profile:
${JSON.stringify(parsedResume)}

Job Description:
${jobDescriptionText}`;

  return generateJSON(prompt);
};
