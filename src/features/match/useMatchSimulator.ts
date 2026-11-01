"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Ball, MatchData } from "@/shared/types";
import defaultMatchData from "@/data/matches/mm-vs-cc-final/match.json";

export interface BatterInnings {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  howOut?: string;
}

export interface BowlerSpell {
  name: string;
  overs: string;
  maidens: number;
  runs: number;
  wickets: number;
}

export function useMatchSimulator(
  match: MatchData = defaultMatchData as unknown as MatchData,
  onOverEnd?: (overNumber: number) => void
) {
  const [currentBallIndex, setCurrentBallIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(2000); // 2000ms per ball at 1x

  const totalBalls = match.balls.length;
  const currentBall: Ball | undefined = match.balls[currentBallIndex];

  // Advance to next ball
  const nextBall = useCallback(() => {
    setCurrentBallIndex((prev) => {
      if (prev < totalBalls - 1) {
        const nextIdx = prev + 1;
        // Check if this completes an over
        const ball = match.balls[nextIdx];
        if (ball.tags.includes("over-end") || (nextIdx + 1) % 6 === 0) {
          const overNum = Math.floor(ball.over);
          if (onOverEnd) onOverEnd(overNum);
        }
        return nextIdx;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [totalBalls, match.balls, onOverEnd]);

  const prevBall = useCallback(() => {
    setCurrentBallIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const jumpToBall = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalBalls) {
        setCurrentBallIndex(index);
      }
    },
    [totalBalls]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Timer loop for simulation
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextBall();
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, nextBall]);

  // Aggregate stats up to current ball
  const stats = useMemo(() => {
    let runsAdded = 0;
    let wicketsCount = match.startState.wickets;

    // Batters map
    const batterMap: Record<string, BatterInnings> = {
      "Arjun Rao": { name: "Arjun Rao", runs: 44, balls: 30, fours: 3, sixes: 0, isOut: false },
      "Kabir Mehta": { name: "Kabir Mehta", runs: 16, balls: 11, fours: 1, sixes: 1, isOut: false },
      "Dev Iyer": { name: "Dev Iyer", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Sameer Khan": { name: "Sameer Khan", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
    };

    // Bowlers map
    const bowlerMap: Record<string, BowlerSpell> = {
      "Vikram Nair": { name: "Vikram Nair", overs: "2.0", maidens: 0, runs: 18, wickets: 1 },
      "Rehan Ali": { name: "Rehan Ali", overs: "2.0", maidens: 0, runs: 14, wickets: 1 },
      "Tushar Pandey": { name: "Tushar Pandey", overs: "2.0", maidens: 0, runs: 19, wickets: 1 },
    };

    for (let i = 0; i <= currentBallIndex; i++) {
      const b = match.balls[i];
      runsAdded += b.runs + (b.extras || 0);

      // Batter stats
      if (batterMap[b.batter]) {
        batterMap[b.batter].balls += 1;
        batterMap[b.batter].runs += b.runs;
        if (b.event === "FOUR") batterMap[b.batter].fours += 1;
        if (b.event === "SIX") batterMap[b.batter].sixes += 1;
      }

      // Wicket
      if (b.wicket) {
        wicketsCount += 1;
        if (batterMap[b.wicket.playerOut]) {
          batterMap[b.wicket.playerOut].isOut = true;
          batterMap[b.wicket.playerOut].howOut = b.wicket.kind;
        }
      }
    }

    const currentScore = match.startState.score + runsAdded;
    const totalBallsBowled = 14 * 6 + (currentBallIndex + 1);
    const completedOvers = Math.floor(totalBallsBowled / 6);
    const ballsInOver = totalBallsBowled % 6;
    const currentOverStr = `${completedOvers}.${ballsInOver}`;

    const ballsRemaining = Math.max(0, 120 - totalBallsBowled);
    const runsNeeded = Math.max(0, match.target - currentScore);

    const crr = totalBallsBowled > 0 ? (currentScore / totalBallsBowled) * 6 : 0;
    const rrr = ballsRemaining > 0 ? (runsNeeded / ballsRemaining) * 6 : 0;

    const isMatchEnded = currentScore >= match.target || wicketsCount >= 10 || ballsRemaining === 0;

    return {
      currentScore,
      wickets: wicketsCount,
      oversStr: currentOverStr,
      ballsRemaining,
      runsNeeded,
      crr: Math.round(crr * 100) / 100,
      rrr: Math.round(rrr * 100) / 100,
      batterMap,
      bowlerMap,
      isMatchEnded,
    };
  }, [match, currentBallIndex]);

  return {
    match,
    currentBallIndex,
    currentBall,
    totalBalls,
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    nextBall,
    prevBall,
    jumpToBall,
    stats,
  };
}
