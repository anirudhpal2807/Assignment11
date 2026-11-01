"use client";

import React from "react";
import { usePreferences } from "./PreferencesContext";
import { FanLevel, Language } from "@/shared/types";
import { Sparkles, Languages, Users, Video } from "lucide-react";

export function PreferencesSelector() {
  const { prefs, setFanLevel, setLanguage, viewMode, setViewMode } = usePreferences();

  const fanLevels: { id: FanLevel; label: string; desc: string }[] = [
    { id: "naya", label: "Naya hoon", desc: "No jargon, simple terms" },
    { id: "regular", label: "Regular", desc: "Balanced, light stats" },
    { id: "diehard", label: "Die-hard", desc: "Tactics, deep numbers" },
  ];

  const languages: { id: Language; label: string }[] = [
    { id: "hinglish", label: "Hinglish" },
    { id: "english", label: "English" },
    { id: "hindi", label: "हिंदी" },
  ];

  return (
    <div className="bg-stadium-800/80 backdrop-blur-md border border-stadium-border/60 rounded-xl p-4 shadow-lg space-y-4">
      {/* View Mode Toggle: Fan vs Creator */}
      <div className="flex items-center justify-between pb-3 border-b border-stadium-border/40">
        <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-blue-400" /> Perspective
        </span>
        <div className="flex bg-stadium-900/90 p-1 rounded-lg border border-stadium-border/80">
          <button
            onClick={() => setViewMode("fan")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === "fan"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3 h-3" /> Fan View
          </button>
          <button
            onClick={() => setViewMode("creator")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              viewMode === "creator"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-3 h-3" /> Creator View
          </button>
        </div>
      </div>

      {/* Fan Level Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fan Level
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {fanLevels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setFanLevel(lvl.id)}
              className={`p-2 rounded-lg text-left transition-all border ${
                prefs.fanLevel === lvl.id
                  ? "bg-blue-500/15 border-blue-500 text-white font-medium shadow-sm ring-1 ring-blue-500/50"
                  : "bg-stadium-900/40 border-stadium-border/40 text-slate-400 hover:text-slate-200 hover:border-stadium-border"
              }`}
            >
              <div className="text-xs font-semibold">{lvl.label}</div>
              <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                {lvl.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Languages className="w-3.5 h-3.5 text-emerald-400" /> Language
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium text-center transition-all border ${
                prefs.language === lang.id
                  ? "bg-emerald-500/15 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50"
                  : "bg-stadium-900/40 border-stadium-border/40 text-slate-400 hover:text-slate-200 hover:border-stadium-border"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
