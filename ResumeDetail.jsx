import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Target, FileEdit, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import client from "../api/client.js";
import ScoreGauge from "../components/ScoreGauge.jsx";
import SkillBadge from "../components/SkillBadge.jsx";

const ResumeDetail = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [history, setHistory] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    client.get(`/resumes/${id}`).then(({ data }) => setResume(data.resume));
    client.get(`/analysis/resume/${id}/history`).then(({ data }) => setHistory(data.history));
  }, [id]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { data } = await client.get(`/resumes/${id}/export`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `ATS-Report-${resume?.fileName || id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (!resume) return <div className="max-w-4xl mx-auto px-6 py-16 text-muted">Loading...</div>;

  const { atsMetrics, parsedContent, strengths, improvementAreas, fileName } = resume;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl mb-1">{fileName}</h1>
          <p className="text-muted text-sm">Scanned {new Date(resume.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 border border-line px-5 py-2.5 rounded-full font-medium hover:border-signal hover:text-signal transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {exporting ? "Preparing..." : "Export PDF"}
          </button>
          <Link
            to={`/matcher?resumeId=${resume._id}`}
            className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 rounded-full font-medium hover:bg-signal transition-colors"
          >
            <Target className="w-4 h-4" /> Match against a job
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-6 mb-12 border border-line rounded-2xl bg-white p-8">
        <ScoreGauge score={atsMetrics.overallScore} label="Overall ATS score" size={150} />
        <ScoreGauge score={atsMetrics.formattingScore} label="Formatting" />
        <ScoreGauge score={atsMetrics.keywordDensityScore} label="Keyword usage" />
        <ScoreGauge score={atsMetrics.actionVerbScore} label="Impact & metrics" />
      </div>

      <div className="grid sm:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="font-display text-xl mb-3">Strengths</h2>
          <ul className="space-y-2">
            {strengths?.map((s, i) => (
              <li key={i} className="text-sm text-ink/80 flex gap-2">
                <span className="text-signal">＋</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl mb-3">Fix these</h2>
          <ul className="space-y-2">
            {improvementAreas?.map((s, i) => (
              <li key={i} className="text-sm text-ink/80 flex gap-2">
                <span className="text-clay">△</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="font-display text-xl mb-3">Extracted skills</h2>
        <div className="flex flex-wrap gap-2">
          {parsedContent?.skills?.map((s, i) => (
            <SkillBadge key={i} label={s} variant="neutral" />
          ))}
        </div>
      </div>

      {history.length > 1 && (
        <div className="mb-12">
          <h2 className="font-display text-xl mb-3">Fit score trend</h2>
          <p className="text-sm text-muted mb-4">Role-match score across your job matches for this resume, over time.</p>
          <div className="border border-line rounded-2xl bg-white p-6">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={history.map((h) => ({ ...h, date: new Date(h.createdAt).toLocaleDateString() }))}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6B6459" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B6459" }} />
                <Tooltip
                  formatter={(value, _name, props) => [`${value}/100`, props.payload.targetJobTitle]}
                />
                <Line type="monotone" dataKey="matchPercentage" stroke="#2F6F5E" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {parsedContent?.experience?.length > 0 && (
        <div>
          <h2 className="font-display text-xl mb-4 flex items-center gap-2">
            <FileEdit className="w-4 h-4 text-signal" /> Experience
          </h2>
          <div className="space-y-6">
            {parsedContent.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-line pl-4">
                <p className="font-medium">
                  {exp.title} · <span className="text-muted">{exp.company}</span>
                </p>
                <p className="text-xs font-mono text-muted mb-2">{exp.duration}</p>
                <ul className="space-y-1">
                  {exp.highlights?.map((h, j) => (
                    <li key={j} className="text-sm text-ink/80">
                      · {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeDetail;
