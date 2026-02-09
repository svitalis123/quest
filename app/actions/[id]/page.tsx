"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  FileText,
  Video,
  Sparkles,
} from "lucide-react";

import {
  getRecommendationById,
  type RecommendationWithContext,
} from "@/services/readinessService";
import {
  getReadinessLevel,
  READINESS_LABELS,
  type ReadinessLevel,
} from "@/types/readiness";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageTransition } from "@/components/common/PageTransition";

// --- Colour maps (same as details page) ---
const LEVEL_COLORS: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-success)",
  developing: "var(--quest-btn-bg)",
  "growth-opportunity": "var(--quest-primary)",
};

const BADGE_TEXT: Record<ReadinessLevel, string> = {
  mastery: "var(--quest-primary)",
  developing: "var(--quest-primary)",
  "growth-opportunity": "#FFFFFF",
};

const RESOURCE_ICONS = {
  link: ExternalLink,
  video: Video,
  document: FileText,
} as const;

export default function ActionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [data, setData] = useState<RecommendationWithContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    getRecommendationById(id)
      .then((result) => {
        if (!result) {
          setError("Recommendation not found.");
        } else {
          setData(result);
        }
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  function toggleStep(stepId: string) {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }

  // --- Loading state ---
  if (isLoading) {
    return (
      <div
        className="mx-auto flex max-w-4xl flex-col gap-6 py-8"
        role="status"
        aria-label="Loading action details"
      >
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    );
  }

  // --- Error state ---
  if (error || !data) {
    return (
      <div className="py-8 text-center text-sm text-quest-desc" role="alert">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const { recommendation: rec, assessment } = data;
  const dimension = rec.dimensionKey
    ? assessment.dimensions[rec.dimensionKey]
    : null;
  const level = dimension ? getReadinessLevel(dimension.score) : null;

  const steps = rec.steps ?? [];
  const resources = rec.resources ?? [];
  const totalSteps = steps.length;
  const doneCount = completedSteps.size;
  const progressPercent = totalSteps > 0 ? (doneCount / totalSteps) * 100 : 0;
  const allDone = totalSteps > 0 && doneCount === totalSteps;

  return (
    <PageTransition>
      <section
        className="mx-auto flex max-w-4xl flex-col gap-6"
        aria-labelledby="action-heading"
      >
        {/* Back link — 48px touch target */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center gap-2 rounded-sm text-sm font-medium text-quest-link focus-visible:ring-2 focus-visible:ring-quest-primary focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Dashboard
          </Link>
        </nav>

        {/* Badges */}
        {dimension && level && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-quest-primary text-white">
              {dimension.label}
            </Badge>
            <Badge
              className="text-xs"
              style={{
                backgroundColor: LEVEL_COLORS[level],
                color: BADGE_TEXT[level],
              }}
            >
              {READINESS_LABELS[level]}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h1
          id="action-heading"
          className="text-xl font-bold leading-tight text-quest-title"
        >
          {rec.text}
        </h1>

        {/* Growth context */}
        {rec.growthContext && (
          <p className="text-sm leading-relaxed text-quest-desc">
            {rec.growthContext}
          </p>
        )}

        {/* Estimated time */}
        {rec.estimatedTime && (
          <div className="flex items-center gap-2 text-sm text-quest-desc">
            <Clock className="size-4" aria-hidden="true" />
            <span>Estimated time: {rec.estimatedTime}</span>
          </div>
        )}

        {/* Progress bar */}
        {totalSteps > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-medium text-quest-desc">
              <span>Progress</span>
              <span>
                {doneCount} of {totalSteps} steps
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-2.5"
              aria-label={`${doneCount} of ${totalSteps} steps completed`}
            />
          </div>
        )}

        {/* Steps accordion */}
        {totalSteps > 0 && (
          <Card>
            <CardHeader className="px-4 pb-2">
              <CardTitle className="text-sm font-bold text-quest-title">
                Steps to Complete
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
              <Accordion type="multiple" className="w-full">
                {steps.map((step) => {
                  const checked = completedSteps.has(step.id);
                  return (
                    <AccordionItem key={step.id} value={step.id}>
                      <AccordionTrigger className="gap-3">
                        <span className="flex items-center gap-3">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleStep(step.id)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Mark "${step.title}" as ${checked ? "incomplete" : "complete"}`}
                            className="size-5"
                          />
                          <span
                            className={
                              checked
                                ? "line-through text-quest-desc"
                                : "text-quest-title"
                            }
                          >
                            {step.title}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-11">
                        <p className="text-quest-desc">{step.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        )}

        {/* Resources */}
        {resources.length > 0 && (
          <Card>
            <CardHeader className="px-4 pb-2">
              <CardTitle className="text-sm font-bold text-quest-title">
                Helpful Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 px-4">
              {resources.map((resource) => {
                const Icon = RESOURCE_ICONS[resource.type];
                return (
                  <a
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-3 rounded-md px-2 text-sm text-quest-link transition-colors hover:bg-quest-btn-bg/20 focus-visible:ring-2 focus-visible:ring-quest-primary focus-visible:ring-offset-2"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {resource.label}
                  </a>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Celebration card */}
        {allDone && (
          <Card className="border-quest-success/30 bg-quest-success/10 dark:bg-quest-success/5">
            <CardContent className="flex items-center gap-3 px-4 py-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-quest-success/20">
                <Sparkles
                  className="size-5 text-quest-success"
                  aria-hidden="true"
                />
              </span>
              <div>
                <p className="text-sm font-bold text-quest-title">
                  All steps completed!
                </p>
                <p className="text-xs text-quest-desc">
                  Amazing work — you are living the &ldquo;Always
                  Growing&rdquo; mindset. Keep building on this momentum!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </PageTransition>
  );
}
