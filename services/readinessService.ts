import type { LearnerProfile, ReadinessAssessment } from "@/types/readiness";
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

const SIMULATED_DELAY_MS = 500;

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
