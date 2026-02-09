"use client";

import {
  createContext,
  useCallback,
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
  learnerId: DEFAULT_LEARNER_ID,
  setLearnerId: () => {},
});

interface ReadinessProviderProps {
  children: ReactNode;
}

export function ReadinessProvider({ children }: ReadinessProviderProps) {
  const [learnerId, setLearnerId] = useState(DEFAULT_LEARNER_ID);
  const [learner, setLearner] = useState<LearnerProfile | null>(null);
  const [currentAssessment, setCurrentAssessment] =
    useState<ReadinessAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSetLearnerId = useCallback((id: string) => {
    setLearnerId(id);
  }, []);

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
    <ReadinessContext
      value={{
        learner,
        currentAssessment,
        isLoading,
        error,
        learnerId,
        setLearnerId: handleSetLearnerId,
      }}
    >
      {children}
    </ReadinessContext>
  );
}
