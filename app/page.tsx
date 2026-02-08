"use client";

import { useReadiness } from "@/hooks/useReadiness";
import { useCoach } from "@/hooks/useCoach";
import { ReadinessGauge } from "@/components/features/ReadinessGauge";
import { SkillCard } from "@/components/features/SkillCard";
import { CoachCard } from "@/components/features/CoachCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/common/PageTransition";
import { FadeInList, FadeInItem } from "@/components/common/FadeInList";

export default function DashboardPage() {
  const { learner, currentAssessment, isLoading, error } = useReadiness();
  const { insight } = useCoach();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-6 py-8" role="status" aria-label="Loading dashboard">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />
        <Skeleton className="h-5 w-32 rounded-full" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-20 w-full rounded-lg" />
        <div className="w-full space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
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

        {/* Overall Readiness Gauge */}
        <ReadinessGauge
          score={currentAssessment.overallScore}
          label={currentAssessment.overallLabel}
          interpretation={currentAssessment.interpretation}
        />

        {/* Skill Area Breakdown */}
        <h2 className="text-lg font-semibold text-quest-title">
          Skill Areas
        </h2>

        <FadeInList className="flex flex-col gap-3">
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
