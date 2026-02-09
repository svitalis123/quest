"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
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

const FOOTER_TEXT: Record<ReadinessLevel, string> = {
  mastery: "Excellent progress — keep it up!",
  developing: "On the right track",
  "growth-opportunity": "Room to grow — you've got this!",
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
  const { icon: TrendIcon, label: trendLabel, className: trendClass } = TREND_CONFIG[trend];

  return (
    <Link
      href={`/details/${dimensionKey}`}
      className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-quest-primary focus-visible:ring-offset-2"
      aria-label={`${label}: ${score}% — View details`}
    >
      <Card className={cn("@container/card shadow-xs transition-shadow group-hover:shadow-md", className)}>
        <CardHeader>
          <CardDescription className="text-quest-desc">{label}</CardDescription>
          <CardTitle
            className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"
            style={{ color: levelColor }}
          >
            {score}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={trendClass}>
              <TrendIcon className="size-3" aria-hidden="true" />
              {trendLabel}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium" style={{ color: levelColor }}>
            {READINESS_LABELS[level]} <TrendIcon className="size-4" aria-hidden="true" />
          </div>
          <div className="text-quest-desc">
            {FOOTER_TEXT[level]}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
