"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Clock, Compass, Loader2 } from "lucide-react";
import { useCatchup } from "./useCatchup";
import { usePreferences } from "../preferences/PreferencesContext";

interface CatchupCardProps {
  matchId: string;
  ballIndex: number;
}

export function CatchupCard({ matchId, ballIndex }: CatchupCardProps) {
  const { prefs } = usePreferences();
  const { summary, watchNext, source, isLoading, error, fetchCatchup } = useCatchup();
  const [hasRequested, setHasRequested] = useState(false);

  // Typewriter text state
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  const handleCatchupClick = () => {
    setHasRequested(true);
    fetchCatchup(matchId, ballIndex, prefs);
  };

  useEffect(() => {
    if (summary) {
      setDisplayedLines(summary);
    }
  }, [summary]);

  return (
    <div className="bg-stadium-800/80 border border-stadium-border/60 rounded-xl p-4 shadow-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Catch-up AI
          </h4>
        </div>
        {source && (
          <span className="text-[10px] text-blue-300 font-mono bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            {source === "ai" ? "🤖 Gemini Flash" : "🛡️ Instant Match Context"}
          </span>
        )}
      </div>

      {!hasRequested ? (
        <div className="text-center py-4 bg-stadium-900/40 rounded-xl border border-dashed border-stadium-border/60 p-4">
          <p className="text-xs text-slate-300 mb-3">
            Late to the stream? Get caught up on key moments in 3 lines.
          </p>
          <button
            onClick={handleCatchupClick}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 mx-auto active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            I just joined — Catch me up!
          </button>
        </div>
      ) : isLoading ? (
        <div className="py-6 flex flex-col items-center justify-center space-y-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-xs">Analyzing match events & momentum...</span>
        </div>
      ) : error ? (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300">
          {error}
          <button
            onClick={handleCatchupClick}
            className="block mt-2 text-blue-400 underline font-medium"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* 3 lines */}
          <div className="space-y-1.5 bg-stadium-900/60 p-3 rounded-lg border border-stadium-border/40">
            {displayedLines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 font-bold font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-snug">{line}</p>
              </div>
            ))}
          </div>

          {/* Watch next */}
          {watchNext && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-200 flex items-start gap-2">
              <Compass className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[11px] block uppercase tracking-wider text-amber-300">
                  What to watch next
                </span>
                <p className="leading-tight mt-0.5 text-slate-200">{watchNext}</p>
              </div>
            </div>
          )}

          <div className="pt-1 flex justify-end">
            <button
              onClick={handleCatchupClick}
              className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Refresh summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
