import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const colorFor = (score) => {
  if (score >= 80) return "#2F6F5E";
  if (score >= 55) return "#C8622A";
  return "#B23A2E";
};

const ScoreGauge = ({ score = 0, label, size = 140 }) => {
  const data = [{ value: score, fill: colorFor(score) }];

  return (
    <div className="flex flex-col items-center">
      <RadialBarChart
        width={size}
        height={size}
        cx={size / 2}
        cy={size / 2}
        innerRadius={size * 0.34}
        outerRadius={size * 0.48}
        barSize={10}
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: "#DCD6C8" }} dataKey="value" cornerRadius={8} />
      </RadialBarChart>
      <div className="-mt-[86px] flex flex-col items-center">
        <span className="font-mono text-2xl font-bold">{Math.round(score)}</span>
        <span className="font-mono text-xs text-muted">/ 100</span>
      </div>
      {label && <span className="mt-3 text-sm font-medium text-muted">{label}</span>}
    </div>
  );
};

export default ScoreGauge;
