import type { LearnerProfile, ReadinessAssessment, Recommendation } from "@/types/readiness";
import readinessJson from "@/services/data/readinessData.json";

export interface ReadinessRecord {
  learner: LearnerProfile;
  currentAssessment: ReadinessAssessment;
}

/** A single point in a dimension's 3-month trend history. */
export interface DimensionHistoryPoint {
  month: string;
  score: number;
}

export interface LearnerProfileSummary {
  id: string;
  firstName: string;
  lastName: string;
}

const SIMULATED_DELAY_MS = 500;

/** Return a summary list of all learner profiles (for the profile switcher). */
export function getLearnerProfiles(): Promise<LearnerProfileSummary[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profiles = (readinessJson as ReadinessRecord[]).map((r) => ({
        id: r.learner.id,
        firstName: r.learner.firstName,
        lastName: r.learner.lastName,
      }));
      resolve(profiles);
    }, SIMULATED_DELAY_MS);
  });
}

/** Return all learner readiness records after a simulated network delay. */
export function getReadinessData(): Promise<ReadinessRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(readinessJson as ReadinessRecord[]), SIMULATED_DELAY_MS);
  });
}

/** Return a single learner's readiness record by ID. */
export function getReadinessDataByLearnerId(
  learnerId: string
): Promise<ReadinessRecord | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = (readinessJson as ReadinessRecord[]).find(
        (r) => r.learner.id === learnerId
      );
      resolve(record);
    }, SIMULATED_DELAY_MS);
  });
}

/**
 * Return simulated 3-month history for a dimension.
 * Derives earlier scores from the current score + trend direction.
 */
export function getDimensionHistory(
  learnerId: string,
  dimensionKey: string
): Promise<DimensionHistoryPoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const record = (readinessJson as ReadinessRecord[]).find(
        (r) => r.learner.id === learnerId
      );
      if (!record) {
        resolve([]);
        return;
      }

      const dim =
        record.currentAssessment.dimensions[
          dimensionKey as keyof typeof record.currentAssessment.dimensions
        ];
      if (!dim) {
        resolve([]);
        return;
      }

      const current = dim.score;
      const delta = dim.trend === "improving" ? 8 : dim.trend === "declining" ? -6 : 2;

      // Work backwards from current month
      const months = ["Dec", "Jan", "Feb"];
      const history: DimensionHistoryPoint[] = months.map((month, i) => ({
        month,
        score: Math.max(0, Math.min(100, current - delta * (months.length - 1 - i))),
      }));

      resolve(history);
    }, SIMULATED_DELAY_MS);
  });
}

/** Context bundle returned alongside a recommendation. */
export interface RecommendationWithContext {
  recommendation: Recommendation;
  learner: LearnerProfile;
  assessment: ReadinessAssessment;
}

/** Look up a single recommendation by ID across all learner records. */
export function getRecommendationById(
  id: string
): Promise<RecommendationWithContext | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      for (const record of readinessJson as ReadinessRecord[]) {
        const rec = record.currentAssessment.recommendations.find(
          (r) => r.id === id
        );
        if (rec) {
          resolve({
            recommendation: rec,
            learner: record.learner,
            assessment: record.currentAssessment,
          });
          return;
        }
      }
      resolve(undefined);
    }, SIMULATED_DELAY_MS);
  });
}
