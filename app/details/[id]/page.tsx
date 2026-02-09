"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import { useReadiness } from "@/hooks/useReadiness";
import { useCountUp } from "@/hooks/useCountUp";
import { getDimensionHistory, type DimensionHistoryPoint } from "@/services/readinessService";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PageTransition } from "@/components/common/PageTransition";
import {
  getReadinessLevel,
  READINESS_LABELS,
  type ReadinessLevel,
  type DimensionTrend,
} from "@/types/readiness";

// --- Colour maps ---
const LEVEL_COLORS: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-success)",
  developing: "var(--quest-btn-bg)",
  "growth-opportunity": "var(--quest-primary)",
};

// WCAG AA: dark text on yellow/green, white on blue
const BADGE_TEXT: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-primary)",
  developing: "var(--quest-primary)",
  "growth-opportunity": "#FFFFFF",
};

const TREND_CONFIG: Record<
  DimensionTrend,
  { icon: typeof TrendingUp; label: string; className: string }
> = {
  improving: { icon: TrendingUp, label: "Improving", className: "text-quest-success" },
  stable: { icon: Minus, label: "Stable", className: "text-quest-desc" },
  declining: { icon: TrendingDown, label: "Declining", className: "text-quest-btn-bg" },
};

// --- Chart configs ---
const trendConfig = {
  score: { label: "Score", color: "var(--quest-primary)" },
} satisfies ChartConfig;

const radarConfig = {
  score: { label: "Score", color: "var(--quest-primary)" },
} satisfies ChartConfig;

export default function DimensionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: dimensionKey } = use(params);
  const { learner, currentAssessment, isLoading, error } = useReadiness();

  const [history, setHistory] = useState<DimensionHistoryPoint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch trend history via service layer
  useEffect(() => {
    if (!learner) return;
    setHistoryLoading(true);
    getDimensionHistory(learner.id, dimensionKey)
      .then(setHistory)
      .finally(() => setHistoryLoading(false));
  }, [learner, dimensionKey]);

  // Count-up for the score (safe to call unconditionally)
  const dimension = currentAssessment?.dimensions[dimensionKey];
  const animatedScore = useCountUp(dimension?.score ?? 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-8" role="status" aria-label="Loading dimension details">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-[250px] w-full rounded-xl" />
        <Skeleton className="h-[250px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !learner || !currentAssessment) {
    return (
      <div className="py-8 text-center text-sm text-quest-desc" role="alert">
        {error ?? "Dimension not found."}
      </div>
    );
  }

  if (!dimension) {
    return (
      <div className="py-8 text-center text-sm text-quest-desc" role="alert">
        Dimension &ldquo;{dimensionKey}&rdquo; not found.
      </div>
    );
  }

  const level = getReadinessLevel(dimension.score);
  const levelColor = LEVEL_COLORS[level];
  const badgeText = BADGE_TEXT[level];
  const { icon: TrendIcon, label: trendLabel, className: trendClass } = TREND_CONFIG[dimension.trend];

  // Radar chart data — all dimensions
  const radarData = Object.values(currentAssessment.dimensions).map((dim) => ({
    dimension: dim.label,
    score: dim.score,
  }));

  return (
    <PageTransition>
      <section className="mx-auto flex max-w-4xl flex-col gap-6" aria-labelledby="dimension-heading">
        {/* Back link — 48px touch target */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center gap-2 text-sm font-medium text-quest-link focus-visible:ring-2 focus-visible:ring-quest-primary focus-visible:ring-offset-2 rounded-sm"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </nav>

        {/* Dimension header */}
        <div className="flex items-center justify-between">
          <h1 id="dimension-heading" className="text-xl font-bold text-quest-title">
            {dimension.label}
          </h1>
          <Badge
            className="text-xs"
            style={{ backgroundColor: levelColor, color: badgeText }}
          >
            {READINESS_LABELS[level]}
          </Badge>
        </div>

        {/* Score + trend summary */}
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold" style={{ color: levelColor }} aria-label={`Score: ${dimension.score}%`}>
            {animatedScore}%
          </span>
          <span className={`flex items-center gap-1 text-sm font-medium ${trendClass}`}>
            <TrendIcon className="size-4" aria-hidden="true" />
            {trendLabel}
          </span>
        </div>

        {/* Charts grid: side-by-side on lg+ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 3-month trend line */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-quest-title">
                3-Month Trend
              </CardTitle>
              <CardDescription className="text-xs text-quest-desc">
                {dimension.label} performance over the last 3 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ChartContainer config={trendConfig} className="h-[200px] w-full">
                  <LineChart
                    accessibilityLayer
                    data={history}
                    margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={4}
                      width={32}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Line
                      dataKey="score"
                      type="natural"
                      stroke="var(--color-score)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--color-score)" }}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Radar chart — dimension balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-quest-title">
                Readiness Balance
              </CardTitle>
              <CardDescription className="text-xs text-quest-desc">
                How {learner.firstName}&apos;s dimensions compare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={radarConfig}
                className="mx-auto aspect-square max-h-[280px]"
              >
                <RadarChart
                  data={radarData}
                  outerRadius="65%"
                  margin={{ top: 24, right: 48, bottom: 24, left: 48 }}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarGrid className="opacity-20" />
                  <PolarAngleAxis
                    dataKey="dimension"
                    tick={{ fontSize: 11, fill: "var(--quest-desc)" }}
                  />
                  <Radar
                    dataKey="score"
                    fill="var(--color-score)"
                    fillOpacity={0.3}
                    stroke="var(--color-score)"
                    strokeWidth={2}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
