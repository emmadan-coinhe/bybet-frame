import * as React from "react";

function IconRingAnchor(props: any) {
  return (
    <svg width={74} height={74} viewBox="0 0 74 74" fill="none" {...props}>
      <g filter="url(#filter0_d)">
        <path
          d="M38.16 13.1v-.001a2.417 2.417 0 00-1.473-.454 2.411 2.411 0 00-1.778.73 2.429 2.429 0 00-.616 1.008L23.548 46.621h0a2.434 2.434 0 00.03 1.662h0c.203.535.56.962 1.04 1.264h0l.006.005.103.07.305.21a3203.86 3203.86 0 014.23 2.936c2.401 1.669 5.052 3.514 6.182 4.301.687.478 1.584.471 2.263.008l11.082-7.545.002-.001c.14-.094.304-.212.432-.34a2.52 2.52 0 00.694-1.197c.112-.47.067-.937-.084-1.377L39.087 14.38a2.444 2.444 0 00-.927-1.28z"
          stroke="url(#paint0_linear)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x={0.215576}
          y={0.171875}
          width={72.9614}
          height={72.9614}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation={5} />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.850345 0" />
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear"
          x1={13.0439}
          y1={36.6543}
          x2={36.6948}
          y2={60.3052}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset={1} stopColor="#E3E0FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default IconRingAnchor;
