interface TrendChartProps {
  data: number[];
  line: number;
  direction: "over" | "under";
}

export default function TrendChart({ data, line, direction }: TrendChartProps) {
  const max = Math.max(...data, line) + 3;
  const min = Math.max(0, Math.min(...data, line) - 3);
  const range = max - min;

  const width = 320;
  const height = 140;
  const padLeft = 32;
  const padRight = 8;
  const padTop = 10;
  const padBottom = 20;

  const chartWidth = width - padLeft - padRight;
  const chartHeight = height - padTop - padBottom;

  const xStep = chartWidth / (data.length - 1);

  function yPos(val: number) {
    return padTop + chartHeight - ((val - min) / range) * chartHeight;
  }

  const lineY = yPos(line);
  const accentColor = direction === "over" ? "#39ff14" : "#ff6b2b";

  const points = data.map((val, i) => ({
    x: padLeft + i * xStep,
    y: yPos(val),
    hit: direction === "over" ? val > line : val < line,
    val,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area under curve
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${padTop + chartHeight}` +
    ` L ${padLeft} ${padTop + chartHeight} Z`;

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-gray-900 border border-gray-800">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height: 160 }}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = padTop + frac * chartHeight;
          const val = max - frac * range;
          return (
            <g key={frac}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#222"
                strokeWidth="1"
              />
              <text
                x={padLeft - 4}
                y={y + 4}
                textAnchor="end"
                fontSize="8"
                fill="#555"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Prop line */}
        <line
          x1={padLeft}
          y1={lineY}
          x2={width - padRight}
          y2={lineY}
          stroke="#ff6b2b"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text
          x={width - padRight + 1}
          y={lineY + 4}
          fontSize="8"
          fill="#ff6b2b"
        >
          {line}
        </text>

        {/* Area fill */}
        <path
          d={areaD}
          fill={`${accentColor}15`}
        />

        {/* Trend line */}
        <path
          d={pathD}
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill={p.hit ? accentColor : "#ff4444"}
              stroke={p.hit ? `${accentColor}88` : "#ff444488"}
              strokeWidth="2"
            />
          </g>
        ))}

        {/* X axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - 4}
            textAnchor="middle"
            fontSize="7"
            fill="#444"
          >
            G{data.length - i}
          </text>
        ))}
      </svg>
    </div>
  );
}
