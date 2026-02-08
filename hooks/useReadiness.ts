"use client";

import { useContext } from "react";
import { ReadinessContext } from "@/context/ReadinessContext";
import type { ReadinessData } from "@/types/readiness";

export function useReadiness(): ReadinessData {
  return useContext(ReadinessContext);
}
