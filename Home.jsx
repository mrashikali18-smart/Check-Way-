import { Link } from "react-router-dom";
import { ArrowRight, ScanLine, Target, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero: the signature scanline sweeping over a mock resume block */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 font-mono text-xs text-signal border border-signal/30 bg-signal/5 rounded-full px-3 py-1 mb-6">
            <ScanLine className="w-3.5 h-3.5" /> ATS-GRADE RESUME SCANNING
          </span>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Know what the algorithm sees<span className="text-signal">.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-md">
            Upload your resume, get an instant ATS compatibility score, and see exactly
            which skills stand between you and the interview.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              to={user ? "/upload" : "/register"}
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded-full font-medium hover:bg-signal transition-colors"
            >
              Scan your resume <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative border border-line rounded-2xl bg-white overflow-hidden shadow-sm scanline">
          <div className="p-6 font-mono text-xs leading-relaxed text-ink/70 space-y-2">
            <p className="text-ink font-semibold">JORDAN RIVERA — Product Designer</p>
            <p>Led redesign of onboarding flow, increasing activation 18%</p>
            <p>Partnered with eng on design system spanning 40+ components</p>
            <p className="text-signal">✓ matched: figma, design systems, a/b testing</p>
            <p className="text-clay">△ missing: user research, prototyping</p>
            <div className="pt-4 mt-4 border-t border-line flex items-center justify-between">
              <span>ATS SCORE</span>
              <span className="text-signal text-base font-bold">84 / 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-8">
        {[
          {
            icon: ScanLine,
            title: "Diagnostic scoring",
            copy: "Formatting, keyword density, and impact-verb usage, broken out so you know exactly what to fix.",
          },
          {
            icon: Target,
            title: "Skill gap analysis",
            copy: "Paste a job description and see your semantic fit score plus the exact skills you're missing.",
          },
          {
            icon: Sparkles,
            title: "Bullet optimizer",
            copy: "Get rewritten bullet points that weave in missing keywords without fabricating claims.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <div key={title} className="border border-line rounded-xl p-6 bg-white/50">
            <Icon className="w-5 h-5 text-signal mb-4" />
            <h3 className="font-display text-lg mb-2">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{copy}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
