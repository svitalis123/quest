"use client";

import { useEffect, useState } from "react";
import { useReadiness } from "@/hooks/useReadiness";
import {
  getLearnerProfiles,
  type LearnerProfileSummary,
} from "@/services/readinessService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProfileSwitcher() {
  const { learnerId, setLearnerId } = useReadiness();
  const [profiles, setProfiles] = useState<LearnerProfileSummary[]>([]);

  useEffect(() => {
    getLearnerProfiles().then(setProfiles);
  }, []);

  if (profiles.length === 0) return null;

  return (
    <Select value={learnerId} onValueChange={setLearnerId}>
      <SelectTrigger
        aria-label="Switch student profile"
        className="h-10 min-w-[140px] border-white/20 bg-white/10 text-sm text-white hover:bg-white/20 focus-visible:ring-white focus-visible:ring-offset-quest-primary [&_svg]:text-white/70"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {profiles.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.firstName} {p.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
