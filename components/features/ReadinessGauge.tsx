"use client";

import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import {
  getReadinessLevel,
  READINESS_LABELS,
  type ReadinessLevel,
} from "@/types/readiness";

// --- RAG colour mapping (growth-mindset: no red) ---
const LEVEL_COLORS: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-success)",      // #42C842
  developing: "var(--quest-btn-bg)",    // #FFD100
  "growth-opportunity": "var(--quest-primary)", // #1E3F75
};

// Badge text: dark text on yellow/green for WCAG AA, white on blue
const BADGE_TEXT: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-primary)",
  developing: "var(--quest-primary)",
  "growth-opportunity": "#FFFFFF",
};

// --- SVG constants (8px-grid friendly: 200 = 25 × 8) ---
const SIZE = 200;
const STROKE_WIDTH = 16;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ReadinessGaugeProps {
  score: number;
  label: string;
  interpretation: string;
  className?: string;
}

export function ReadinessGauge({
  score,
  label,
  interpretation,
  className,
}: ReadinessGaugeProps) {
  const level = getReadinessLevel(score);
  const strokeColor = LEVEL_COLORS[level];
  const badgeText = BADGE_TEXT[level];
  const animatedScore = useCountUp(score);
  const offset = CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  return (
    <div
      className={cn("flex flex-col items-center gap-4", className)}
      role="region"
      aria-label="Overall readiness score"
    >
      {/* Circular gauge */}
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          role="img"
          aria-label={`Readiness score: ${score}%`}
        >
          {/* Background track */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="var(--border)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress arc */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={strokeColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>

        {/* Centre text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold leading-none"
            style={{ color: strokeColor }}
            aria-hidden="true"
          >
            {animatedScore}%
          </span>
          <span className="mt-1 text-sm font-medium text-quest-title">
            {label}
          </span>
        </div>
      </div>

      {/* Readiness level badge */}
      <span
        className="rounded-full px-3 py-1 text-xs font-semibold"
        style={{ backgroundColor: strokeColor, color: badgeText }}
      >
        {READINESS_LABELS[level]}
      </span>

      {/* Interpretation from data */}
      <p className="text-center text-sm leading-relaxed text-quest-desc">
        {interpretation}
      </p>
    </div>
  );
}
