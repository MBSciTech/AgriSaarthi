import React from "react";

function formatTime(unix) {
  if (!unix) return "-";
  return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Helper to get angle (in radians) for a given time on the circle
function getAngleForTime(currentTime, sunrise, sunset) {
  // Convert current time to seconds since midnight if it's a timestamp
  let timeOfDay;
  if (currentTime > 86400) {
    // It's a unix timestamp, convert to seconds since midnight
    const date = new Date(currentTime * 1000);
    timeOfDay = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  } else {
    // It's already seconds since midnight
    timeOfDay = currentTime;
  }
  
  // Convert sunrise and sunset to seconds since midnight if they're timestamps
  let sunriseTime, sunsetTime;
  if (sunrise > 86400) {
    const sunriseDate = new Date(sunrise * 1000);
    sunriseTime = sunriseDate.getHours() * 3600 + sunriseDate.getMinutes() * 60 + sunriseDate.getSeconds();
  } else {
    sunriseTime = sunrise;
  }
  
  if (sunset > 86400) {
    const sunsetDate = new Date(sunset * 1000);
    sunsetTime = sunsetDate.getHours() * 3600 + sunsetDate.getMinutes() * 60 + sunsetDate.getSeconds();
  } else {
    sunsetTime = sunset;
  }
  
  const dayLength = sunsetTime - sunriseTime;
  
  if (timeOfDay >= sunriseTime && timeOfDay <= sunsetTime) {
    // Daytime: sun moves along bottom arc from sunrise (left) to sunset (right)
    const dayProgress = (timeOfDay - sunriseTime) / dayLength;
    // Map from 9 o'clock (PI) to 3 o'clock (0) going clockwise (bottom of circle)
    return Math.PI - (dayProgress * Math.PI);
  } else {
    // Nighttime: moon moves along top arc
    let nightProgress;
    const nightLength = (24 * 3600) - dayLength;
    
    if (timeOfDay > sunsetTime) {
      // After sunset, before midnight
      nightProgress = (timeOfDay - sunsetTime) / nightLength;
    } else {
      // After midnight, before sunrise
      nightProgress = ((24 * 3600 - sunsetTime) + timeOfDay) / nightLength;
    }
    
    // Map from 3 o'clock (0) to 9 o'clock (PI) going counterclockwise (top of circle)
    return nightProgress * Math.PI;
  }
}

export default function SunPath({ sunrise, sunset, current }) {
  if (!sunrise || !sunset) return null;
  
  // Use current time if not provided
  const currentTime = current || Math.floor(Date.now() / 1000);

  // SVG setup
  const size = 260;
  const r = 100;
  const cx = size / 2;
  const cy = size / 2;

  // Angles
  const sunriseAngle = Math.PI; // 9 o'clock (left)
  const sunsetAngle = 0;       // 3 o'clock (right)
  const currentAngle = getAngleForTime(currentTime, sunrise, sunset);

  // Helper to get (x, y) on circle for angle
  const getXY = (angle) => [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];

  // Determine if current time is day or night
  let isDay;
  if (currentTime > 86400) {
    // Unix timestamp
    const date = new Date(currentTime * 1000);
    const timeOfDay = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
    const sunriseTime = sunrise > 86400 ? new Date(sunrise * 1000).getHours() * 3600 + new Date(sunrise * 1000).getMinutes() * 60 : sunrise;
    const sunsetTime = sunset > 86400 ? new Date(sunset * 1000).getHours() * 3600 + new Date(sunset * 1000).getMinutes() * 60 : sunset;
    isDay = (timeOfDay >= sunriseTime && timeOfDay <= sunsetTime);
  } else {
    // Seconds since midnight
    isDay = (currentTime >= sunrise && currentTime <= sunset);
  }

  // Arc path for day (sunrise to sunset, lower half)
  const [sx, sy] = getXY(sunriseAngle);
  const [ex, ey] = getXY(sunsetAngle);
  const dayArc = `M${sx},${sy} A${r},${r} 0 0 1 ${ex},${ey}`;
  // Arc path for night (sunset to next sunrise, upper half)
  const nightArc = `M${ex},${ey} A${r},${r} 0 0 1 ${sx},${sy}`;

  // Pointer (sun or moon)
  const [px, py] = getXY(currentAngle);

  // Sun/Moon SVG
  const Sun = (
    <g>
      <circle cx={px} cy={py} r={16} fill="#ff9800" stroke="#fffde4" strokeWidth="4" />
      {[...Array(12)].map((_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        const x1 = px + Math.cos(angle) * 20;
        const y1 = py + Math.sin(angle) * 20;
        const x2 = px + Math.cos(angle) * 28;
        const y2 = py + Math.sin(angle) * 28;
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
  );
  
  const Moon = (
    <g>
      <circle cx={px} cy={py} r={15} fill="#b3c6ff" stroke="#fffde4" strokeWidth="3" />
      {/* Crescent effect */}
      <ellipse cx={px+5} cy={py-2} rx={8} ry={13} fill="#fffde4" opacity="0.7" />
    </g>
  );

  // Sunrise/Sunset markers
  const marker = (x, y, color) => (
    <g>
      <circle cx={x} cy={y} r={13} fill={color} stroke="#fffde4" strokeWidth="3" />
    </g>
  );

  // Current time display
  const currentTimeString = currentTime > 86400 
    ? formatTime(currentTime)
    : formatTime(Math.floor(Date.now() / 1000));

  return (
    <div className="glass-card p-4" style={{ maxWidth: 320, margin: "0 auto", borderRadius: 24 }}>
      
      
      <svg width={size} height={size} style={{ display: 'block', margin: '0 auto', width: '100%', height: 'auto' }}>
        {/* Night arc (upper half) */}
        <path d={nightArc} fill="none" stroke="#bdbdbd" strokeWidth="7" strokeDasharray="6,7" opacity="0.5" />
        {/* Day arc (lower half) */}
        <path d={dayArc} fill="none" stroke="#ffa726" strokeWidth="7" strokeDasharray="10,8" />
        {/* Sunrise marker */}
        {marker(sx, sy, "#ffe082")}
        {/* Sunset marker */}
        {marker(ex, ey, "#ce93d8")}
        {/* Sun or Moon pointer */}
        {isDay ? Sun : Moon}
        {/* Sunrise label and time */}
        <text x={sx} y={sy + 32} textAnchor="middle" fontSize="14" fill="#ffa726" fontWeight="bold">Sunrise</text>
        <text x={sx} y={sy + 48} textAnchor="middle" fontSize="12" fill="#888">{formatTime(sunrise)}</text>
        {/* Sunset label and time */}
        <text x={ex} y={ey + 32} textAnchor="middle" fontSize="14" fill="#8e24aa" fontWeight="bold">Sunset</text>
        <text x={ex} y={ey + 48} textAnchor="middle" fontSize="12" fill="#888">{formatTime(sunset)}</text>
      </svg>
    </div>
  );
}
