// -------------------------------------------------------------
// Quest Learner Readiness Platform — Domain Types
// -------------------------------------------------------------

/** Readiness level derived from a percentage score. */
export type ReadinessLevel = "growth-opportunity" | "developing" | "mastery";

/** Resolve a numeric score (0–100) to its readiness level. */
export function getReadinessLevel(score: number): ReadinessLevel {
  if (score > 80) return "mastery";
  if (score >= 60) return "developing";
  return "growth-opportunity";
}

/** Display label for each readiness level (growth-mindset framing). */
export const READINESS_LABELS: Record<ReadinessLevel, string> = {
  "growth-opportunity": "Growth Opportunity",
  developing: "Developing",
  mastery: "Mastery",
};

// ---- Learner ------------------------------------------------

export interface LearnerProfile {
  id: string;
  firstName: string;
  lastName: string;
  grade: number;
  school: string;
  region: string;
  avatarUrl?: string;
}

// ---- Dimensions & Scores ------------------------------------

export type DimensionTrend = "improving" | "stable" | "declining";

/** A single readiness dimension (e.g. Academics, Career Skills). */
export interface ReadinessDimension {
  score: number; // 0–100
  label: string;
  trend: DimensionTrend;
  lastUpdated: string; // ISO 8601
}

/** Map of dimension keys to their data. */
export interface ReadinessDimensions {
  academics: ReadinessDimension;
  career_skills: ReadinessDimension;
  life_skills: ReadinessDimension;
  entrepreneurship: ReadinessDimension;
  [key: string]: ReadinessDimension;
}

// ---- Recommendations ----------------------------------------

export type RecommendationType = "action" | "encouragement";

export interface Recommendation {
  id: string;
  text: string;
  type: RecommendationType;
}

// ---- Assessment ---------------------------------------------

/** A complete readiness assessment as stored in JSON. */
export interface ReadinessAssessment {
  learnerId: string;
  overallScore: number; // 0–100
  overallLabel: string;
  interpretation: string;
  dimensions: ReadinessDimensions;
  recommendations: Recommendation[];
}

// ---- Aggregated State (provided via Context) ----------------

/** The shape of data surfaced by the ReadinessContext provider. */
export interface ReadinessData {
  learner: LearnerProfile | null;
  currentAssessment: ReadinessAssessment | null;
  isLoading: boolean;
  error: string | null;
}
