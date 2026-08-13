import { Check, X } from "lucide-react";

const SkillBadge = ({ label, variant = "neutral" }) => {
  const styles = {
    match: "bg-signal/10 text-signal border-signal/30",
    missing: "bg-clay/10 text-clay border-clay/30",
    neutral: "bg-ink/5 text-ink border-line",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-mono ${styles[variant]}`}
    >
      {variant === "match" && <Check className="w-3 h-3" />}
      {variant === "missing" && <X className="w-3 h-3" />}
      {label}
    </span>
  );
};

export default SkillBadge;
