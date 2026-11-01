"use client";

import React, { useEffect } from "react";
import { Ball } from "@/shared/types";
import { useExplain } from "./useExplain";
import { usePreferences } from "../preferences/PreferencesContext";
import { X, Sparkles, Loader2, Info } from "lucide-react";

interface ExplainerPopoverProps {
  ball: Ball | null;
  matchId: string;
  onClose: () => void;
}

export function ExplainerPopover({ ball, matchId, onClose }: ExplainerPopoverProps) {
  const { prefs, setFanLevel } = usePreferences();
  const { explanation, source, isLoading, explainBall } = useExplain();

  useEffect(() => {
    if (ball) {
      explainBall(matchId, ball, prefs);
    }
  }, [ball, matchId, prefs, explainBall]);

  if (!ball) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-stadium-800 border border-blue-500/50 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 glow-blue">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stadium-border/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold font-mono text-xs">
              {ball.over}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Ye kya hua?</span>
                <span className="text-[10px] font-normal text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Moment Explainer
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {ball.bowler} to {ball.batter} • {ball.runs} runs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-stadium-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fan Level Quick Switcher inside modal */}
        <div className="bg-stadium-900/60 p-1.5 rounded-xl border border-stadium-border/50 flex gap-1 text-xs">
          {(["naya", "regular", "diehard"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFanLevel(lvl)}
              className={`flex-1 py-1 px-2 rounded-lg font-medium capitalize text-center transition-all ${
                prefs.fanLevel === lvl
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {lvl === "naya" ? "Naya Hoon" : lvl === "regular" ? "Regular" : "Die-Hard"}
            </button>
          ))}
        </div>

        {/* Explanation Content */}
        <div className="min-h-[90px] flex items-center justify-center bg-stadium-900/40 p-4 rounded-xl border border-stadium-border/40">
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing ball mechanics & context...</span>
            </div>
          ) : (
            <p className="text-sm text-slate-100 leading-relaxed font-sans">
              {explanation}
            </p>
          )}
        </div>

        {/* Ball tags & source footer */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{prefs.language}</span>
            <span>•</span>
            <span className="capitalize">{prefs.fanLevel} perspective</span>
          </div>

          <div className="flex items-center gap-1 text-blue-400 font-mono text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>{source === "ai" ? "Gemini Flash" : "Pre-computed Context"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
