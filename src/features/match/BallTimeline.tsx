"use client";

import React, { useRef, useEffect } from "react";
import { Ball } from "@/shared/types";
import { HelpCircle } from "lucide-react";

interface BallTimelineProps {
  balls: Ball[];
  currentBallIndex: number;
  onSelectBall: (ball: Ball) => void;
  selectedBallIndex?: number | null;
}

export function BallTimeline({
  balls,
  currentBallIndex,
  onSelectBall,
  selectedBallIndex,
}: BallTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep active ball visible
  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.children[currentBallIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentBallIndex]);

  const getBallBadge = (ball: Ball, isCurrent: boolean, isSelected: boolean) => {
    let bg = "bg-stadium-900/80 text-slate-300 border-stadium-border/60";

    if (ball.wicket) {
      bg = "bg-red-600 text-white border-red-400 font-bold glow-crimson";
    } else if (ball.event === "SIX") {
      bg = "bg-amber-500 text-stadium-900 font-extrabold border-amber-300 glow-amber";
    } else if (ball.event === "FOUR") {
      bg = "bg-emerald-500 text-stadium-900 font-extrabold border-emerald-300 glow-emerald";
    } else if (ball.event === "DRS_NOT_TAKEN") {
      bg = "bg-purple-600 text-white font-bold border-purple-400 animate-pulse";
    } else if (ball.event === "DROPPED_CATCH") {
      bg = "bg-amber-700/80 text-amber-200 border-amber-400";
    } else if (ball.runs === 0) {
      bg = "bg-stadium-900/40 text-slate-500 border-stadium-border/40";
    }

    const ringStyle = isSelected
      ? "ring-2 ring-white ring-offset-2 ring-offset-stadium-900 scale-110 z-10"
      : isCurrent
      ? "ring-2 ring-blue-400 ring-offset-1 ring-offset-stadium-900 scale-105"
      : "";

    return `${bg} ${ringStyle}`;
  };

  return (
    <div className="bg-stadium-800/80 border border-stadium-border/60 rounded-xl p-4 shadow-lg space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
          <span>Ball-by-Ball Timeline</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-blue-400">
          <HelpCircle className="w-3 h-3" />
          <span>Tap ball to explain</span>
        </div>
      </div>

      {/* Horizontal Scrollable Timeline */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none"
      >
        {balls.map((ball) => {
          const isCurrent = ball.index === currentBallIndex;
          const isSelected = ball.index === selectedBallIndex;
          const isPassed = ball.index <= currentBallIndex;

          return (
            <button
              key={ball.index}
              onClick={() => onSelectBall(ball)}
              className={`flex-shrink-0 flex flex-col items-center group transition-transform ${
                !isPassed ? "opacity-30 hover:opacity-75" : ""
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono border transition-all ${getBallBadge(
                  ball,
                  isCurrent,
                  isSelected
                )}`}
              >
                {ball.wicket
                  ? "W"
                  : ball.event === "DRS_NOT_TAKEN"
                  ? "DRS"
                  : ball.event === "DROPPED_CATCH"
                  ? "DROP"
                  : ball.runs === 0
                  ? "•"
                  : ball.runs}
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1">
                {ball.over}
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Ball Commentary Snippet */}
      {balls[currentBallIndex] && (
        <div className="bg-stadium-900/60 p-2.5 rounded-lg border border-stadium-border/40 text-xs text-slate-300 flex items-start gap-2">
          <span className="font-mono font-bold text-blue-400">
            {balls[currentBallIndex].over}
          </span>
          <p className="line-clamp-2 text-slate-200">
            {balls[currentBallIndex].commentary}
          </p>
        </div>
      )}
    </div>
  );
}
