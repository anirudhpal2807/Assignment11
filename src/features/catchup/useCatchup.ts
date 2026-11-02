"use client";

import { useState, useCallback } from "react";
import { UserPrefs } from "@/shared/types";

interface CatchupState {
  summary: [string, string, string] | null;
  watchNext: string | null;
  source: "ai" | "fallback" | null;
  isLoading: boolean;
  error: string | null;
}

export function useCatchup() {
  const [state, setState] = useState<CatchupState>({
    summary: null,
    watchNext: null,
    source: null,
    isLoading: false,
    error: null,
  });

  const fetchCatchup = useCallback(
    async (matchId: string, ballIndex: number, prefs: UserPrefs) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const res = await fetch("/api/catchup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchId,
            ballIndex,
            prefs,
          }),
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch catch-up: status ${res.status}`);
        }

        const data = await res.json();
        setState({
          summary: data.summary,
          watchNext: data.watchNext,
          source: data.source,
          isLoading: false,
          error: null,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Error fetching catch-up";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: msg,
        }));
      }
    },
    []
  );

  return {
    ...state,
    fetchCatchup,
  };
}

