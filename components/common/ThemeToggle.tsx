"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const CYCLE = ["light", "dark", "system"] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function cycle() {
    const idx = CYCLE.indexOf(theme as (typeof CYCLE)[number]);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    setTheme(next);
  }

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${theme}. Click to switch.`}
      className="inline-flex size-12 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-quest-primary"
    >
      {theme === "dark" ? (
        <Moon className="size-5" />
      ) : theme === "light" ? (
        <Sun className="size-5" />
      ) : (
        <Monitor className="size-5" />
      )}
    </button>
  );
}
