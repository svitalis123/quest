"use client";

import { useMemo } from "react";
import { useReadiness } from "@/hooks/useReadiness";
import {
  getReadinessLevel,
  READINESS_LABELS,
  type ReadinessLevel,
  type Recommendation,
  type ReadinessDimension,
} from "@/types/readiness";

export interface CoachInsight {
  /** The dimension key with the lowest score. */
  focusKey: string;
  /** The full dimension object for the focus area. */
  focusDimension: ReadinessDimension;
  /** Readiness level of the focus area. */
  focusLevel: ReadinessLevel;
  /** Growth-mindset label for the focus area. */
  focusLabel: string;
  /** Personalised headline from the coach. */
  headline: string;
  /** Action recommendations from the assessment data. */
  actions: Recommendation[];
  /** Encouragement recommendations from the assessment data. */
  encouragements: Recommendation[];
}

function buildHeadline(
  firstName: string,
  focusDimension: ReadinessDimension,
  focusLevel: ReadinessLevel,
): string {
  if (focusLevel === "growth-opportunity") {
    return `${firstName}, ${focusDimension.label} is your biggest growth opportunity — small steps here will make a big difference!`;
  }
  if (focusLevel === "developing") {
    return `${firstName}, keep building on your ${focusDimension.label} progress — you're almost there!`;
  }
  // mastery across the board
  return `Amazing, ${firstName}! You're demonstrating mastery across all areas. Consider mentoring a peer.`;
}

export interface UseCoachResult {
  insight: CoachInsight | null;
  isLoading: boolean;
}

export function useCoach(): UseCoachResult {
  const { learner, currentAssessment, isLoading } = useReadiness();

  const insight = useMemo<CoachInsight | null>(() => {
    if (!learner || !currentAssessment) return null;

    // Find the lowest-scoring dimension
    const entries = Object.entries(currentAssessment.dimensions);
    const [focusKey, focusDimension] = entries.reduce(
      (lowest, current) => (current[1].score < lowest[1].score ? current : lowest),
      entries[0],
    );

    const focusLevel = getReadinessLevel(focusDimension.score);
    const focusLabel = READINESS_LABELS[focusLevel];

    const headline = buildHeadline(learner.firstName, focusDimension, focusLevel);

    const actions = currentAssessment.recommendations.filter((r) => r.type === "action");
    const encouragements = currentAssessment.recommendations.filter((r) => r.type === "encouragement");

    return {
      focusKey,
      focusDimension,
      focusLevel,
      focusLabel,
      headline,
      actions,
      encouragements,
    };
  }, [learner, currentAssessment]);

  return { insight, isLoading };
}
