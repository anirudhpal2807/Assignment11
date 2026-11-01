"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Activity, Flame, ShieldAlert, Smile } from "lucide-react";
import { MoodPoint } from "./useRoomPulse";

interface MoodMeterProps {
  currentMood: {
    tension: number;
    hype: number;
    anger: number;
    humour: number;
    label: string;
  };
  moodHistory: MoodPoint[];
}

export function MoodMeter({ currentMood, moodHistory }: MoodMeterProps) {
  return (
    <div className="bg-stadium-800/80 border border-stadium-border/60 rounded-xl p-4 shadow-lg space-y-3">
      {/* Header & Dominant Mood */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Room Mood Meter
          </h4>
        </div>
        <div className="flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 px-2.5 py-1 rounded-full text-purple-300 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
          <span>{currentMood.label}</span>
        </div>
      </div>

      {/* Mini metric pills */}
      <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
        <div className="bg-stadium-900/50 p-1.5 rounded-lg border border-red-500/20">
          <div className="text-[10px] text-red-400 font-medium flex items-center justify-center gap-0.5">
            <Flame className="w-2.5 h-2.5" /> Tension
          </div>
          <div className="font-mono font-bold text-white text-xs mt-0.5">
            {currentMood.tension}%
          </div>
        </div>
        <div className="bg-stadium-900/50 p-1.5 rounded-lg border border-amber-500/20">
          <div className="text-[10px] text-amber-400 font-medium flex items-center justify-center gap-0.5">
            <Activity className="w-2.5 h-2.5" /> Hype
          </div>
          <div className="font-mono font-bold text-white text-xs mt-0.5">
            {currentMood.hype}%
          </div>
        </div>
        <div className="bg-stadium-900/50 p-1.5 rounded-lg border border-orange-500/20">
          <div className="text-[10px] text-orange-400 font-medium flex items-center justify-center gap-0.5">
            <ShieldAlert className="w-2.5 h-2.5" /> Anger
          </div>
          <div className="font-mono font-bold text-white text-xs mt-0.5">
            {currentMood.anger}%
          </div>
        </div>
        <div className="bg-stadium-900/50 p-1.5 rounded-lg border border-emerald-500/20">
          <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-0.5">
            <Smile className="w-2.5 h-2.5" /> Banter
          </div>
          <div className="font-mono font-bold text-white text-xs mt-0.5">
            {currentMood.humour}%
          </div>
        </div>
      </div>

      {/* Recharts Line Chart */}
      <div className="h-32 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodHistory} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="over"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(v) => `Ov ${v}`}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                fontSize: "11px",
              }}
            />
            <Line
              type="monotone"
              dataKey="tension"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              name="Tension"
            />
            <Line
              type="monotone"
              dataKey="hype"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 2.5 }}
              name="Hype"
            />
            <Line
              type="monotone"
              dataKey="anger"
              stroke="#ea580c"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              dot={false}
              name="Anger"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
