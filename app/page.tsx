"use client";

import { useReadiness } from "@/hooks/useReadiness";
import { useCoach } from "@/hooks/useCoach";
import { ReadinessGauge } from "@/components/features/ReadinessGauge";
import { SkillCard } from "@/components/features/SkillCard";
import { CoachCard } from "@/components/features/CoachCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageTransition } from "@/components/common/PageTransition";
import { FadeInList, FadeInItem } from "@/components/common/FadeInList";

export default function DashboardPage() {
  const { learner, currentAssessment, isLoading, error } = useReadiness();
  const { insight } = useCoach();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-8" role="status" aria-label="Loading dashboard">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-[340px] rounded-xl" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !learner || !currentAssessment) {
    return (
      <div className="py-8 text-center text-sm text-quest-desc" role="alert">
        {error ?? "Unable to load your readiness data."}
      </div>
    );
  }

  const dimensionEntries = Object.entries(currentAssessment.dimensions);

  return (
    <PageTransition>
      <section className="flex flex-col gap-6" aria-labelledby="dashboard-heading">
        {/* Greeting */}
        <h1 id="dashboard-heading" className="text-xl font-bold text-quest-title">
          Welcome back, {learner.firstName}
        </h1>

        {/* Main dashboard grid: gauge left, skill cards right on lg+ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Overall Readiness Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-quest-title">
                Overall Readiness
              </CardTitle>
              <CardDescription className="text-xs text-quest-desc">
                Your current readiness score
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ReadinessGauge
                score={currentAssessment.overallScore}
                label={currentAssessment.overallLabel}
                interpretation={currentAssessment.interpretation}
              />
            </CardContent>
          </Card>

          {/* Skill Area Breakdown — 2-col grid in the remaining 2/3 */}
          <div className="flex flex-col gap-3 lg:col-span-2">
            <h2 className="text-lg font-semibold text-quest-title">
              Skill Areas
            </h2>

            <FadeInList className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {dimensionEntries.map(([key, dim]) => (
                <FadeInItem key={key}>
                  <SkillCard
                    dimensionKey={key}
                    label={dim.label}
                    score={dim.score}
                    trend={dim.trend}
                  />
                </FadeInItem>
              ))}
            </FadeInList>
          </div>
        </div>

        {/* Success Coach Insights */}
        {insight && (
          <section aria-labelledby="coach-heading">
            <h2 id="coach-heading" className="mb-3 text-lg font-semibold text-quest-title">
              Success Coach
            </h2>
            <CoachCard insight={insight} />
          </section>
        )}
      </section>
    </PageTransition>
  );
}
