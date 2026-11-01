"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { UserPrefs, RoomPulseResponse } from "@/shared/types";
import fallbackData from "@/data/matches/mm-vs-cc-final/fallback.json";

export interface MoodPoint {
  over: number;
  tension: number;
  hype: number;
  anger: number;
  humour: number;
  label: string;
}

export function useRoomPulse(
  matchId: string,
  currentOver: number,
  recentChat: { user: string; text: string }[],
  prefs: UserPrefs
) {
  const initialOverFallback = fallbackData.roomPulse["15"];
  const [topQuestions, setTopQuestions] = useState(initialOverFallback.topQuestions);
  const [currentMood, setCurrentMood] = useState(initialOverFallback.mood);
  const [creatorTips, setCreatorTips] = useState(initialOverFallback.creatorTips);
  const [source, setSource] = useState<"ai" | "fallback">("fallback");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // History for Mood Meter Chart
  const [moodHistory, setMoodHistory] = useState<MoodPoint[]>([
    {
      over: 14,
      tension: 35,
      hype: 60,
      anger: 10,
      humour: 30,
      label: "Steady Start",
    },
    {
      over: 15,
      tension: 45,
      hype: 70,
      anger: 10,
      humour: 35,
      label: initialOverFallback.mood.label,
    },
  ]);

  const lastFetchedOver = useRef<number>(14);

  const fetchPulse = useCallback(
    async (overNum: number) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/room-pulse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matchId,
            overNumber: overNum,
            recentChat: recentChat.slice(-15),
            prefs,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch room pulse");
        const data: RoomPulseResponse = await res.json();

        setTopQuestions(data.topQuestions);
        setCurrentMood(data.mood);
        setCreatorTips(data.creatorTips);
        setSource(data.source);

        setMoodHistory((prev) => {
          const filtered = prev.filter((p) => p.over !== overNum);
          return [
            ...filtered,
            {
              over: overNum,
              tension: data.mood.tension,
              hype: data.mood.hype,
              anger: data.mood.anger,
              humour: data.mood.humour,
              label: data.mood.label,
            },
          ].sort((a, b) => a.over - b.over);
        });
      } catch (err) {
        console.warn("Room pulse fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [matchId, recentChat, prefs]
  );

  // Trigger when over changes
  useEffect(() => {
    if (currentOver > lastFetchedOver.current && currentOver >= 15) {
      lastFetchedOver.current = currentOver;
      fetchPulse(currentOver);
    }
  }, [currentOver, fetchPulse]);

  return {
    topQuestions,
    currentMood,
    creatorTips,
    moodHistory,
    source,
    isLoading,
    refreshPulse: () => fetchPulse(currentOver),
  };
}
