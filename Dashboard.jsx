import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, ChevronRight, Trash2 } from "lucide-react";
import client from "../api/client.js";

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await client.get("/resumes");
    setResumes(data.resumes);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    await client.delete(`/resumes/${id}`);
    setResumes((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Your resumes</h1>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 rounded-full font-medium hover:bg-signal transition-colors"
        >
          <Plus className="w-4 h-4" /> New scan
        </Link>
      </div>

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : resumes.length === 0 ? (
        <div className="border border-dashed border-line rounded-2xl p-12 text-center">
          <FileText className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="text-muted">No resumes yet. Upload one to get your first ATS score.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((r) => (
            <div
              key={r._id}
              className="flex items-center justify-between border border-line rounded-xl px-5 py-4 bg-white hover:border-signal/40 transition-colors group"
            >
              <Link to={`/resumes/${r._id}`} className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-signal/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-signal" />
                </div>
                <div>
                  <p className="font-medium">{r.fileName}</p>
                  <p className="text-xs text-muted">
                    {new Date(r.createdAt).toLocaleDateString()} · ATS score{" "}
                    <span className="font-mono font-semibold text-ink">
                      {r.atsMetrics?.overallScore ?? "—"}
                    </span>
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(r._id)}
                  className="p-2 text-muted hover:text-clay transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Delete resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link to={`/resumes/${r._id}`}>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
