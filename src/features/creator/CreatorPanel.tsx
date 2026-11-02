"use client";

import React from "react";
import { Mic, Radio, MessageSquare, Sparkles, CheckCircle2 } from "lucide-react";

interface CreatorPanelProps {
  tips: string[];
  currentMoodLabel: string;
  tension: number;
  hype: number;
  source?: "ai" | "fallback";
}

export function CreatorPanel({
  tips,
  currentMoodLabel,
  tension,
  hype,
  source = "fallback",
}: CreatorPanelProps) {
  return (
    <div className="bg-gradient-to-br from-stadium-800 to-amber-950/30 border border-amber-500/40 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Creator Teleprompter</span>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                Co-host AI
              </span>
            </h4>
            <p className="text-[10px] text-slate-400">
              Live broadcast cue card synced with audience pulse
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          <Sparkles className="w-3 h-3" />
          <span>{source === "ai" ? "Gemini Live" : "Smart Cue"}</span>
        </div>
      </div>

      {/* Audience Mood Snapshot for Creator */}
      <div className="bg-stadium-900/60 p-3 rounded-lg border border-stadium-border/40 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            Audience Mood
          </div>
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{currentMoodLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-right">
            <span className="text-[10px] text-red-400 block">Tension</span>
            <span className="text-white font-bold">{tension}%</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-amber-400 block">Hype</span>
            <span className="text-white font-bold">{hype}%</span>
          </div>
        </div>
      </div>

      {/* Say These 3 Things Next */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
          <Mic className="w-3.5 h-3.5 text-amber-400" />
          <span>Say these 3 things next to the stream:</span>
        </div>

        <div className="space-y-2">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-stadium-900/80 border border-amber-500/20 rounded-xl p-3 text-xs text-slate-100 flex items-start gap-2.5 hover:border-amber-500/40 transition-all shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="leading-relaxed font-medium">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Updates automatically every over based on chat topics</span>
      </div>
    </div>
  );
}

