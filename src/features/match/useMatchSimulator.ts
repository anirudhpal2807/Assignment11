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
  const [speed, setSpeed] = useState<number>(4000); // 4000ms (4 seconds) per ball at 1x

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
        if (nextIdx >= totalBalls - 1) {
          setIsPlaying(false);
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

  const reset = useCallback(() => {
    setCurrentBallIndex(0);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      // If match is at the last ball, restart from ball 0 and play!
      if (!prev && currentBallIndex >= totalBalls - 1) {
        setCurrentBallIndex(0);
        return true;
      }
      return !prev;
    });
  }, [currentBallIndex, totalBalls]);

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

    // Batters map initialized from 0 runs
    const batterMap: Record<string, BatterInnings> = {
      "KL Rahul": { name: "KL Rahul", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Rohit Sharma": { name: "Rohit Sharma", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Virat Kohli": { name: "Virat Kohli", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Suryakumar Yadav": { name: "Suryakumar Yadav", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Axar Patel": { name: "Axar Patel", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Hardik Pandya": { name: "Hardik Pandya", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Dinesh Karthik": { name: "Dinesh Karthik", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
      "Ravichandran Ashwin": { name: "Ravichandran Ashwin", runs: 0, balls: 0, fours: 0, sixes: 0, isOut: false },
    };

    // Bowlers map
    const bowlerMap: Record<string, BowlerSpell> = {
      "Shaheen Shah Afridi": { name: "Shaheen Shah Afridi", overs: "0.0", maidens: 0, runs: 0, wickets: 0 },
      "Naseem Shah": { name: "Naseem Shah", overs: "0.0", maidens: 0, runs: 0, wickets: 0 },
      "Haris Rauf": { name: "Haris Rauf", overs: "0.0", maidens: 0, runs: 0, wickets: 0 },
      "Shadab Khan": { name: "Shadab Khan", overs: "0.0", maidens: 0, runs: 0, wickets: 0 },
      "Mohammad Nawaz": { name: "Mohammad Nawaz", overs: "0.0", maidens: 0, runs: 0, wickets: 0 },
    };

    // Track bowler balls bowled for spell computation
    const bowlerBallsCount: Record<string, number> = {};

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

      // Bowler stats
      if (bowlerMap[b.bowler]) {
        bowlerBallsCount[b.bowler] = (bowlerBallsCount[b.bowler] || 0) + 1;
        bowlerMap[b.bowler].runs += b.runs + (b.extras || 0);
        if (b.wicket && b.wicket.kind !== "run_out") {
          bowlerMap[b.bowler].wickets += 1;
        }
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

    // Format bowler overs
    for (const bName of Object.keys(bowlerMap)) {
      const balls = bowlerBallsCount[bName] || 0;
      const bOvers = Math.floor(balls / 6);
      const bBalls = balls % 6;
      bowlerMap[bName].overs = `${bOvers}.${bBalls}`;
    }

    const currentScore = match.startState.score + runsAdded;
    const startBalls = (match.startOver || 0) * 6;
    const totalBallsBowled = startBalls + (currentBallIndex + 1);
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
    reset,
    stats,
  };
}
