import React from 'react';

// Simple SVG pie chart. `data` can be an array of numbers or
// an array of objects: { label, value, color }.
const DEFAULT_COLORS = [
  '#4e73df',
  '#1cc88a',
  '#36b9cc',
  '#f6c23e',
  '#e74a3b',
  '#858796',
];

function formatData(data = []) {
  // normalize numbers to objects
  return data.map((d, i) => {
    if (typeof d === 'number') return { label: `#${i + 1}`, value: d, color: DEFAULT_COLORS[i % DEFAULT_COLORS.length] };
    return {
      label: d.label || `#${i + 1}`,
      value: Number(d.value) || 0,
      color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    };
  });
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  const d = [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, 'Z'].join(' ');
  return d;
}

const SimplePieChart = ({ data = [], height = 140, subText = "" }) => {
  const items = formatData(data);
  const total = items.reduce((s, it) => s + it.value, 0) || 1;

  // SVG viewBox 0 0 100 100, draw circle centered at 50,50
  const cx = 50;
  const cy = 50;
  const r = 40; // radius

  let angle = 0;

  return (
    <div style={{ height }}>
      <h6 className="mb-2">Vaccination Coverage</h6>
      <div className="d-flex align-items-center">
        <svg viewBox="0 0 100 100" width="120" height="120" role="img" aria-label="Pie chart">
          <title>Pie chart</title>
          {items.map((it, idx) => {
            const valuePercent = (it.value / total) * 100;
            const startAngle = angle;
            const endAngle = angle + (valuePercent / 100) * 360;
            const path = describeArc(cx, cy, r, startAngle, endAngle);
            angle = endAngle;
            return <path key={idx} d={path} fill={it.color} stroke="#fff" strokeWidth="0.5" />;
          })}
          {/* center label */}
          <circle cx={cx} cy={cy} r={r * 0.55} fill="rgba(255,255,255,0.9)" />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="#333">
            {`${Math.round((items[0]?.value / total) * 100)}%`}
          </text>
        </svg>

        <div style={{ marginLeft: 12 }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 12, height: 12, background: it.color, display: 'inline-block', borderRadius: 2 }} />
              <div style={{ fontSize: 12 }}>
                <div style={{ fontWeight: 600 }}>{it.label}</div>
                <div style={{ fontSize: 11, color: '#666' }}>{`${it.value} (${((it.value / total) * 100).toFixed(1)}%)`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;