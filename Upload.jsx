import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import client from "../api/client.js";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const acceptFile = (f) => {
    if (!f) return;
    const okTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!okTypes.includes(f.type)) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }
    setError("");
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await client.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/resumes/${data.resume._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Scan a resume</h1>
      <p className="text-muted mb-8">PDF or DOCX, up to 5MB. We'll extract, score, and diagnose it.</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          acceptFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          dragging ? "border-signal bg-signal/5" : "border-line bg-white"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-8 h-8 text-signal" />
            <p className="font-medium">{file.name}</p>
            <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-8 h-8 text-muted" />
            <p className="font-medium">Drop your resume here, or click to browse</p>
            <p className="text-xs text-muted">.pdf or .docx</p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-clay mt-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={!file || loading}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-ink text-paper rounded-full py-3 font-medium hover:bg-signal transition-colors disabled:opacity-40"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing resume...
          </>
        ) : (
          "Run ATS scan"
        )}
      </button>
    </div>
  );
};

export default Upload;
