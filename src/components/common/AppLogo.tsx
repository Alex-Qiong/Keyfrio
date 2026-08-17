import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: number;
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = 'w-7 h-7', size }) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={style}
    >
      <defs>
        {/* Top Segment Gradient: Cyan to Royal Blue to Purple */}
        <linearGradient id="keyfrio-grad-top" x1="100" y1="100" x2="420" y2="260" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="30%" stopColor="#00A2FF" />
          <stop offset="70%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Bottom Segment Gradient: Turquoise to Deep Blue to Bright Violet */}
        <linearGradient id="keyfrio-grad-bot" x1="100" y1="240" x2="420" y2="440" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00B4D8" />
          <stop offset="30%" stopColor="#2563EB" />
          <stop offset="70%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>

        {/* Subtle glow filter */}
        <filter id="logo-subtle-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#3b82f6" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Container with subtle soft shadow */}
      <g filter="url(#logo-subtle-glow)">
        {/* 1. Upper Play-Button Half (Separated by the cut) */}
        <path
          d="M 108 214 L 108 145 C 108 108 148 85 180 104 L 388 224 C 416 240 416 260 405 272 L 108 214 Z"
          fill="url(#keyfrio-grad-top)"
        />

        {/* 2. Lower Play-Button Half (Separated by the cut) */}
        <path
          d="M 108 238 L 400 296 C 416 308 412 328 388 342 L 180 462 C 148 480 108 458 108 420 L 108 238 Z"
          fill="url(#keyfrio-grad-bot)"
        />

        {/* 3. Film Strip Perforation Sprocket Holes (White Rounded Rectangles) */}
        {/* Top Segment Sprockets */}
        <rect x="138" y="126" width="32" height="28" rx="8" fill="#FFFFFF" />
        <rect x="138" y="174" width="32" height="28" rx="8" fill="#FFFFFF" />

        {/* Bottom Segment Sprockets */}
        <rect x="138" y="270" width="32" height="28" rx="8" fill="#FFFFFF" />
        <rect x="138" y="318" width="32" height="28" rx="8" fill="#FFFFFF" />
        <rect x="138" y="366" width="32" height="28" rx="8" fill="#FFFFFF" />

        {/* 4. White Diagonal Cut Line */}
        <path
          d="M 102 216 L 310 274"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* 5. Scissor Component Cutting In */}
        <g id="scissor-cutting">
          {/* Scissor Blades pointing towards bottom-left */}
          {/* Upper Blade */}
          <path
            d="M 180 398 L 295 288 L 305 285 L 285 292 Z"
            fill="#FFFFFF"
          />
          {/* Lower Blade */}
          <path
            d="M 180 398 L 295 288 L 298 296 L 278 294 Z"
            fill="#FFFFFF"
          />

          {/* Scissor Blade Stroke for extra sharpness */}
          <path
            d="M 180 398 L 295 288"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Scissor Handle Arms */}
          <path
            d="M 295 288 L 338 250"
            stroke="#FFFFFF"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M 295 288 L 348 308"
            stroke="#FFFFFF"
            strokeWidth="15"
            strokeLinecap="round"
          />

          {/* Scissor Upper Ring / Loop */}
          <circle cx="356" cy="240" r="28" stroke="#FFFFFF" strokeWidth="12" fill="none" />

          {/* Scissor Lower Ring / Loop */}
          <circle cx="366" cy="316" r="28" stroke="#FFFFFF" strokeWidth="12" fill="none" />

          {/* Scissor Center Pivot Screw */}
          <circle cx="295" cy="288" r="9" fill="#2563EB" stroke="#FFFFFF" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
};
