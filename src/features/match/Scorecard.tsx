"use client";

import React from "react";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Flame, AlertCircle } from "lucide-react";
import { MatchData } from "@/shared/types";
import { BatterInnings, BowlerSpell } from "./useMatchSimulator";

interface ScorecardProps {
  match: MatchData;
  currentScore: number;
  wickets: number;
  oversStr: string;
  ballsRemaining: number;
  runsNeeded: number;
  crr: number;
  rrr: number;
  batterMap: Record<string, BatterInnings>;
  bowlerMap: Record<string, BowlerSpell>;
  currentBatterName?: string;
  currentBowlerName?: string;
  isPlaying: boolean;
  speed: number;
  currentBallIndex?: number;
  totalBalls?: number;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
  onNextBall: () => void;
  onPrevBall: () => void;
  onReset?: () => void;
}

export function Scorecard({
  match,
  currentScore,
  wickets,
  oversStr,
  ballsRemaining,
  runsNeeded,
  crr,
  rrr,
  batterMap,
  bowlerMap,
  currentBatterName = "KL Rahul",
  currentBowlerName = "Shaheen Shah Afridi",
  isPlaying,
  speed,
  currentBallIndex = 0,
  totalBalls = match.balls.length,
  onTogglePlay,
  onSetSpeed,
  onNextBall,
  onPrevBall,
  onReset,
}: ScorecardProps) {
  const activeBatters = Object.values(batterMap).filter((b) => !b.isOut).slice(0, 2);
  const activeBowler = bowlerMap[currentBowlerName] || Object.values(bowlerMap)[0];
  const isEnd = currentBallIndex >= totalBalls - 1;

  return (
    <div className="bg-stadium-800/90 border border-stadium-border/70 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Tournament & Teams Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[11px] font-bold tracking-wider uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
            Live Chase
          </span>
          <span className="text-xs text-slate-400 font-medium">Final • T20</span>
        </div>
        <div className="text-xs text-slate-400">
          Target: <strong className="text-white font-mono">{match.target}</strong>
        </div>
      </div>

      {/* Main Score & Teams Display */}
      <div className="flex items-center justify-between bg-stadium-900/60 p-4 rounded-xl border border-stadium-border/40">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {match.chasing}
            </h2>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
              {currentScore}/{wickets}
            </span>
            <span className="text-sm font-mono text-slate-400">({oversStr} ov)</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span>{match.battingFirst.team}</span>
          </div>
          <div className="text-sm font-mono text-slate-300 mt-1">
            {match.battingFirst.score}/{match.battingFirst.wickets} (20 ov)
          </div>
        </div>
      </div>

      {/* Required Runs Equation Banner */}
      <div
        className={`px-4 py-2.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
          runsNeeded === 0
            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 glow-emerald"
            : rrr > 12
            ? "bg-red-500/15 border-red-500/40 text-red-200 glow-crimson"
            : "bg-blue-500/10 border-blue-500/30 text-blue-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {runsNeeded === 0 ? (
            <Flame className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400" />
          )}
          <span className="text-sm font-semibold tracking-wide">
            {runsNeeded === 0
              ? `${match.chasing} won the match! Historic MCG Chase! 🏆`
              : `Need ${runsNeeded} runs from ${ballsRemaining} balls`}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>
            CRR: <strong className="text-white">{crr}</strong>
          </span>
          <span>
            RRR:{" "}
            <strong className={rrr > 12 ? "text-red-400" : "text-amber-300"}>
              {rrr}
            </strong>
          </span>
        </div>
      </div>

      {/* Batters & Bowler Mini Stats */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Batting pair */}
        <div className="bg-stadium-900/40 p-2.5 rounded-lg border border-stadium-border/30 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Batting
          </div>
          {activeBatters.map((b) => (
            <div
              key={b.name}
              className="flex justify-between items-center text-slate-200 font-mono"
            >
              <span className="text-xs truncate max-w-[90px]">
                {b.name} {b.name === currentBatterName ? "*" : ""}
              </span>
              <span className="text-white font-bold">
                {b.runs}{" "}
                <span className="text-slate-400 font-normal">({b.balls})</span>
              </span>
            </div>
          ))}
        </div>

        {/* Current Bowler */}
        <div className="bg-stadium-900/40 p-2.5 rounded-lg border border-stadium-border/30 space-y-1.5">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Bowler
          </div>
          <div className="text-xs font-semibold text-slate-200 truncate">
            {currentBowlerName}
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Spell</span>
            <span className="text-white font-medium">
              {activeBowler ? `${activeBowler.wickets}-${activeBowler.runs}` : "0-14"}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Playback & Speed Controls */}
      <div className="pt-2 border-t border-stadium-border/40 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {onReset && (
            <button
              onClick={onReset}
              title="Reset match to ball 0.1"
              className="p-1.5 rounded-lg bg-stadium-700/60 hover:bg-stadium-700 text-slate-300 hover:text-white transition-all border border-stadium-border/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onPrevBall}
            title="Previous ball"
            disabled={currentBallIndex === 0}
            className="p-1.5 rounded-lg bg-stadium-700/60 hover:bg-stadium-700 text-slate-300 hover:text-white transition-all border border-stadium-border/50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onTogglePlay}
            title={isPlaying ? "Pause" : isEnd ? "Replay Match from start" : "Play"}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : isEnd
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : isEnd ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" /> Replay
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play
              </>
            )}
          </button>
          <button
            onClick={onNextBall}
            title="Next ball"
            disabled={isEnd}
            className="p-1.5 rounded-lg bg-stadium-700/60 hover:bg-stadium-700 text-slate-300 hover:text-white transition-all border border-stadium-border/50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Buttons */}
        <div className="flex items-center gap-1 bg-stadium-900/80 p-0.5 rounded-lg border border-stadium-border/60">
          {[
            { label: "1x", value: 4000 },
            { label: "2x", value: 2000 },
            { label: "4x", value: 1000 },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => onSetSpeed(s.value)}
              className={`px-2 py-1 text-[11px] font-mono font-medium rounded-md transition-all ${
                speed === s.value
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

