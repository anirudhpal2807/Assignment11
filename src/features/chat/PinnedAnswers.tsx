"use client";

import React, { useState } from "react";
import { Pin, Users, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface QuestionItem {
  question: string;
  askedBy: number;
  answer: string;
}

interface PinnedAnswersProps {
  questions: QuestionItem[];
  source?: "ai" | "fallback";
}

export function PinnedAnswers({ questions, source = "fallback" }: PinnedAnswersProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-950/70 to-slate-900/90 border border-blue-500/30 rounded-xl p-3 shadow-md relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-blue-500/20 text-blue-400">
            <Pin className="w-3.5 h-3.5 rotate-45" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Pinned Answers</span>
              <span className="text-[10px] text-blue-400 font-normal flex items-center gap-1 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                <Sparkles className="w-2.5 h-2.5" />
                {source === "ai" ? "Gemini Flash" : "AI Co-host"}
              </span>
            </h4>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expanded Questions List */}
      {isExpanded && (
        <div className="mt-2.5 space-y-2">
          {questions.map((item, idx) => (
            <div
              key={idx}
              className="bg-stadium-900/70 border border-stadium-border/40 rounded-lg p-2.5 text-xs transition-all hover:border-blue-500/40"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold text-slate-100 flex-1">
                  {item.question}
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap font-mono">
                  <Users className="w-2.5 h-2.5" />
                  ~{item.askedBy}
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed bg-blue-950/30 p-1.5 rounded border border-blue-500/20">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

