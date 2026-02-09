"use client";

import Link from "next/link";
import { Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CoachInsight } from "@/hooks/useCoach";

interface CoachCardProps {
  insight: CoachInsight;
  className?: string;
}

export function CoachCard({ insight, className }: CoachCardProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Headline card — Quest yellow */}
      <Card className="border-0 bg-quest-btn-bg shadow-sm dark:bg-quest-btn-bg/80">
        <CardHeader className="px-4 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-quest-primary dark:text-[#1E3F75]">
            <Sparkles className="size-4" />
            Your Success Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4">
          <p className="text-sm leading-relaxed text-quest-primary/80 dark:text-[#1E3F75]/80">
            {insight.headline}
          </p>

          {/* Focus area badge */}
          <div className="mt-3 flex items-center gap-2">
            <Badge className="bg-quest-primary text-white">
              Focus: {insight.focusDimension.label}
            </Badge>
            <Badge variant="outline" className="border-quest-primary/30 text-quest-primary dark:border-[#1E3F75]/30 dark:text-[#1E3F75]">
              {insight.focusLabel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Action cards */}
      {insight.actions.map((rec) => (
        <Card key={rec.id} className="gap-0 py-3">
          <CardContent className="flex items-start gap-3 px-4">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-quest-btn-bg/30">
              <Lightbulb className="size-4 text-quest-primary" />
            </span>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-sm leading-relaxed text-quest-title">
                {rec.text}
              </p>
              <Link
                href={`/actions/${rec.id}`}
                className="inline-flex min-h-12 items-center gap-1 self-start rounded-md bg-quest-btn-bg px-4 text-xs font-semibold text-quest-primary transition-colors hover:bg-quest-btn-hover hover:text-white dark:text-[#1E3F75] dark:hover:text-white"
              >
                Take Action
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Encouragement cards */}
      {insight.encouragements.map((rec) => (
        <Card key={rec.id} className="gap-0 border-quest-success/20 py-3">
          <CardContent className="flex items-start gap-3 px-4">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-quest-success/15">
              <Sparkles className="size-4 text-quest-success" />
            </span>
            <p className="text-sm leading-relaxed text-quest-title">
              {rec.text}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
