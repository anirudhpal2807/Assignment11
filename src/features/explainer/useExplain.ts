"use client";

import { useState, useCallback } from "react";
import { UserPrefs, Ball } from "@/shared/types";

interface UseExplainReturn {
  explanation: string | null;
  source: "ai" | "fallback" | null;
  isLoading: boolean;
  error: string | null;
  explainBall: (matchId: string, ball: Ball, prefs: UserPrefs) => Promise<void>;
  reset: () => void;
}

export function useExplain(): UseExplainReturn {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const explainBall = useCallback(
    async (matchId: string, ball: Ball, prefs: UserPrefs) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchId,
            ballIndex: ball.index,
            prefs,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to explain ball: status ${res.status}`);
        }

        const data = await res.json();
        setExplanation(data.explanation);
        setSource(data.source);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error fetching explanation";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setExplanation(null);
    setSource(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    explanation,
    source,
    isLoading,
    error,
    explainBall,
    reset,
  };
}

