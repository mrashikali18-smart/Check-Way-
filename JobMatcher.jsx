import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import client from "../api/client.js";
import ScoreGauge from "../components/ScoreGauge.jsx";
import SkillBadge from "../components/SkillBadge.jsx";

const JobMatcher = () => {
  const [searchParams] = useSearchParams();
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState(searchParams.get("resumeId") || "");
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    client.get("/resumes").then(({ data }) => setResumes(data.resumes));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const { data } = await client.post("/analysis/match", {
        resumeId,
        targetJobTitle,
        companyName,
        jobDescriptionText,
      });
      setResult(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Could not run the match. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Match against a job</h1>
      <p className="text-muted mb-8">
        Paste a target job description to see your fit score and missing skills.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 mb-12">
        <div>
          <label className="block text-xs font-mono text-muted mb-1">RESUME</label>
          <select
            required
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="w-full border border-line rounded-lg px-4 py-2.5 bg-white focus-ring focus:outline-none"
          >
            <option value="">Select a scanned resume</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.fileName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-muted mb-1">JOB TITLE</label>
            <input
              required
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              placeholder="Senior Product Designer"
              className="w-full border border-line rounded-lg px-4 py-2.5 bg-white focus-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted mb-1">COMPANY (OPTIONAL)</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              className="w-full border border-line rounded-lg px-4 py-2.5 bg-white focus-ring focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-muted mb-1">JOB DESCRIPTION</label>
          <textarea
            required
            rows={8}
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full border border-line rounded-lg px-4 py-2.5 bg-white focus-ring focus:outline-none resize-none"
          />
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-ink text-paper rounded-full py-3 font-medium hover:bg-signal transition-colors disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing fit...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Run skill gap analysis
            </>
          )}
        </button>
      </form>

      {result && (
        <div className="border border-line rounded-2xl bg-white p-8">
          <div className="flex justify-center mb-8">
            <ScoreGauge score={result.matchPercentage} label="Role fit score" size={160} />
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-display text-lg mb-3">Matching skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.matchingSkills?.map((s, i) => (
                  <SkillBadge key={i} label={s} variant="match" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-lg mb-3">Missing skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((s, i) => (
                  <SkillBadge key={i} label={s} variant="missing" />
                ))}
              </div>
            </div>
          </div>

          {result.tailoredBulletSuggestions?.length > 0 && (
            <div>
              <h3 className="font-display text-lg mb-3">Suggested bullet rewrites</h3>
              <ul className="space-y-2">
                {result.tailoredBulletSuggestions.map((b, i) => (
                  <li key={i} className="text-sm bg-signal/5 border border-signal/20 rounded-lg px-4 py-3">
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobMatcher;
