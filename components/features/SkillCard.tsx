"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getReadinessLevel,
  READINESS_LABELS,
  type ReadinessLevel,
  type DimensionTrend,
} from "@/types/readiness";

// --- RAG colour mapping (mirrors ReadinessGauge) ---
const LEVEL_COLORS: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-success)",
  developing: "var(--quest-btn-bg)",
  "growth-opportunity": "var(--quest-primary)",
};

// Badge text: dark on yellow/green for WCAG AA, white on blue
const BADGE_TEXT: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-primary)",
  developing: "var(--quest-primary)",
  "growth-opportunity": "#FFFFFF",
};

const TREND_CONFIG: Record<
  DimensionTrend,
  { icon: typeof TrendingUp; label: string; className: string }
> = {
  improving: {
    icon: TrendingUp,
    label: "Improving",
    className: "text-quest-success",
  },
  stable: {
    icon: Minus,
    label: "Stable",
    className: "text-quest-desc",
  },
  declining: {
    icon: TrendingDown,
    label: "Declining",
    className: "text-quest-btn-bg",
  },
};

interface SkillCardProps {
  dimensionKey: string;
  label: string;
  score: number;
  trend: DimensionTrend;
  className?: string;
}

export function SkillCard({
  dimensionKey,
  label,
  score,
  trend,
  className,
}: SkillCardProps) {
  const level = getReadinessLevel(score);
  const levelColor = LEVEL_COLORS[level];
  const badgeText = BADGE_TEXT[level];
  const { icon: TrendIcon, label: trendLabel, className: trendClass } = TREND_CONFIG[trend];

  return (
    <Card className={cn("gap-0 py-4", className)} role="article" aria-label={`${label}: ${score}%`}>
      <CardHeader className="px-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-quest-title">
            {label}
          </CardTitle>
          <Badge
            className="text-[10px]"
            style={{ backgroundColor: levelColor, color: badgeText }}
          >
            {READINESS_LABELS[level]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex items-center justify-between px-4">
        {/* Score + Trend */}
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold"
            style={{ color: levelColor }}
          >
            {score}%
          </span>
          <span className={cn("flex items-center gap-1 text-xs font-medium", trendClass)}>
            <TrendIcon className="size-4" aria-hidden="true" />
            {trendLabel}
          </span>
        </div>

        {/* 48×48 touch target link */}
        <Link
          href={`/details/${dimensionKey}`}
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md bg-quest-btn-bg px-3 text-xs font-semibold text-quest-primary transition-colors hover:bg-quest-btn-hover hover:text-white focus-visible:ring-2 focus-visible:ring-quest-primary focus-visible:ring-offset-2"
          aria-label={`View details for ${label}`}
        >
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}
