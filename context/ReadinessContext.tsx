"use client";

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  LearnerProfile,
  ReadinessAssessment,
  ReadinessData,
} from "@/types/readiness";
import { getReadinessData } from "@/services/readinessService";

const DEFAULT_LEARNER_ID = "nov-2026-001";

export const ReadinessContext = createContext<ReadinessData>({
  learner: null,
  currentAssessment: null,
  isLoading: true,
  error: null,
});

interface ReadinessProviderProps {
  learnerId?: string;
  children: ReactNode;
}

export function ReadinessProvider({
  learnerId = DEFAULT_LEARNER_ID,
  children,
}: ReadinessProviderProps) {
  const [learner, setLearner] = useState<LearnerProfile | null>(null);
  const [currentAssessment, setCurrentAssessment] =
    useState<ReadinessAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getReadinessData()
      .then((records) => {
        if (cancelled) return;

        const match = records.find((r) => r.learner.id === learnerId);
        if (match) {
          setLearner(match.learner);
          setCurrentAssessment(match.currentAssessment);
        } else {
          setError(`Learner "${learnerId}" not found`);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load readiness data");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [learnerId]);

  return (
    <ReadinessContext value={{ learner, currentAssessment, isLoading, error }}>
      {children}
    </ReadinessContext>
  );
}
