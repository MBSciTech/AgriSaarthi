import React from "react";

function formatTime(unix) {
  if (!unix) return "-";
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function SunPath({ sunrise, sunset, current }) {
  if (!sunrise || !sunset || !current) return null;
  const clamped = Math.max(sunrise, Math.min(current, sunset));
  const percent = ((clamped - sunrise) / (sunset - sunrise));
  const width = 520;
  const height = 180;
  const arcRadius = 80;
  const arcCenterX = width / 2;
  const arcCenterY = height * 0.75;
  // Arc: 180deg (left) to 0deg (right)
  const startAngle = Math.PI;
  const endAngle = 0;
  const sunAngle = startAngle + (endAngle - startAngle) * percent;
  // Arc endpoints
  const startX = arcCenterX + arcRadius * Math.cos(startAngle);
  const startY = arcCenterY + arcRadius * Math.sin(startAngle);
  const endX = arcCenterX + arcRadius * Math.cos(endAngle);
  const endY = arcCenterY + arcRadius * Math.sin(endAngle);
  // Sun position
  const sunX = arcCenterX + arcRadius * Math.cos(sunAngle);
  const sunY = arcCenterY + arcRadius * Math.sin(sunAngle);

  return (
    <div className="glass-card p-4" style={{ maxWidth: 560, margin: "0 auto", borderRadius: 24 }}>
      <svg width={width} height={height} style={{ display: 'block', margin: '0 auto', width: '100%', height: 'auto' }}>
        {/* Dashed arc */}
        <path
          d={`M${startX},${startY} A${arcRadius},${arcRadius} 0 0 1 ${endX},${endY}`}
          fill="none"
          stroke="#ffa726"
          strokeWidth="4"
          strokeDasharray="10,8"
        />
        {/* Sunrise marker */}
        <g>
          <circle cx={startX} cy={startY} r={16} fill="#ffe082" stroke="#fffde4" strokeWidth="3" />
          {/* Sun icon rays */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const x1 = startX + Math.cos(angle) * 18;
            const y1 = startY + Math.sin(angle) * 18;
            const x2 = startX + Math.cos(angle) * 24;
            const y2 = startY + Math.sin(angle) * 24;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffe082"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {/* Sunset marker */}
        <g>
          <circle cx={endX} cy={endY} r={16} fill="#ce93d8" stroke="#fffde4" strokeWidth="3" />
          {/* Sunset rays */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 8;
            const x1 = endX + Math.cos(angle) * 18;
            const y1 = endY + Math.sin(angle) * 18;
            const x2 = endX + Math.cos(angle) * 24;
            const y2 = endY + Math.sin(angle) * 24;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ce93d8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {/* Sun (real-time) */}
        <g>
          <circle cx={sunX} cy={sunY} r={18} fill="#ff9800" stroke="#fffde4" strokeWidth="4" />
          {/* Sun rays */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 12;
            const x1 = sunX + Math.cos(angle) * 20;
            const y1 = sunY + Math.sin(angle) * 20;
            const x2 = sunX + Math.cos(angle) * 28;
            const y2 = sunY + Math.sin(angle) * 28;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffb74d"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </g>
        {/* Sunrise label and time */}
        <text x={startX} y={startY + 38} textAnchor="middle" fontSize="15" fill="#ffa726" fontWeight="bold">Sunrise</text>
        <text x={startX} y={startY + 56} textAnchor="middle" fontSize="13" fill="#888">{formatTime(sunrise)}</text>
        {/* Sunset label and time */}
        <text x={endX} y={endY + 38} textAnchor="middle" fontSize="15" fill="#8e24aa" fontWeight="bold">Sunset</text>
        <text x={endX} y={endY + 56} textAnchor="middle" fontSize="13" fill="#888">{formatTime(sunset)}</text>
      </svg>
    </div>
  );
} 