"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Tv, MessageSquare } from "lucide-react";
import { useMatchSimulator } from "@/features/match/useMatchSimulator";
import { useChatStream } from "@/features/chat/useChatStream";
import { useRoomPulse } from "@/features/room-pulse/useRoomPulse";
import { usePreferences } from "@/features/preferences/PreferencesContext";
import { Scorecard } from "@/features/match/Scorecard";
import { BallTimeline } from "@/features/match/BallTimeline";
import { ChatFeed } from "@/features/chat/ChatFeed";
import { MoodMeter } from "@/features/room-pulse/MoodMeter";
import { CatchupCard } from "@/features/catchup/CatchupCard";
import { CreatorPanel } from "@/features/creator/CreatorPanel";
import { PreferencesSelector } from "@/features/preferences/PreferencesSelector";
import { ExplainerPopover } from "@/features/explainer/ExplainerPopover";
import { Ball } from "@/shared/types";

export default function WatchAlongPage() {
  const { prefs, viewMode } = usePreferences();

  // Mobile navigation tab state: 'match' | 'chat' | 'foryou'
  const [activeMobileTab, setActiveMobileTab] = useState<"match" | "chat" | "foryou">("match");

  // Selected ball for "Ye kya hua?" moment explainer
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);

  // Initialize Simulator
  const {
    match,
    currentBallIndex,
    currentBall,
    totalBalls,
    isPlaying,
    speed,
    setSpeed,
    togglePlay,
    nextBall,
    prevBall,
    jumpToBall,
    reset,
    stats,
  } = useMatchSimulator();

  // Synced Chat Stream
  const { messages, sendUserMessage, recentChatForPrompt } = useChatStream(currentBallIndex);

  // Room Pulse (Batched top questions + mood + creator tips per over)
  const currentOverNum = Math.max(1, Math.min(20, Math.ceil((currentBallIndex + 1) / 6)));
  const {
    topQuestions,
    currentMood,
    creatorTips,
    moodHistory,
    source: pulseSource,
  } = useRoomPulse(match.id, currentOverNum, recentChatForPrompt, prefs);

  return (
    <div className="min-h-screen bg-stadium-900 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 border-b border-stadium-border/60 bg-stadium-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-stadium-800 hover:bg-stadium-700 text-slate-300 hover:text-white transition-all border border-stadium-border/40"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
              Stands<span className="text-blue-500">.</span>
            </span>
            <span className="text-xs bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded border border-blue-500/20 hidden sm:inline-block">
              AI Co-host
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-stadium-800/80 px-3 py-1 rounded-full border border-stadium-border/60 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Room Live</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">Over {stats.oversStr}</span>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex border-b border-stadium-border/60 bg-stadium-800/50 p-1">
        <button
          onClick={() => setActiveMobileTab("match")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === "match"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Tv className="w-3.5 h-3.5" /> Match
        </button>
        <button
          onClick={() => setActiveMobileTab("chat")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === "chat"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Chat
        </button>
        <button
          onClick={() => setActiveMobileTab("foryou")}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === "foryou"
              ? "bg-blue-600 text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> For You
        </button>
      </div>

      {/* Main 3-Column Layout */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* COLUMN 1: MATCH (Scorecard + Ball Timeline) */}
        <section
          className={`lg:col-span-4 space-y-4 ${
            activeMobileTab === "match" ? "block" : "hidden lg:block"
          }`}
        >
          <Scorecard
            match={match}
            currentScore={stats.currentScore}
            wickets={stats.wickets}
            oversStr={stats.oversStr}
            ballsRemaining={stats.ballsRemaining}
            runsNeeded={stats.runsNeeded}
            crr={stats.crr}
            rrr={stats.rrr}
            batterMap={stats.batterMap}
            bowlerMap={stats.bowlerMap}
            currentBatterName={currentBall?.batter}
            currentBowlerName={currentBall?.bowler}
            isPlaying={isPlaying}
            speed={speed}
            currentBallIndex={currentBallIndex}
            totalBalls={totalBalls}
            onTogglePlay={togglePlay}
            onSetSpeed={setSpeed}
            onNextBall={nextBall}
            onPrevBall={prevBall}
            onReset={reset}
          />

          <BallTimeline
            balls={match.balls}
            currentBallIndex={currentBallIndex}
            onSelectBall={(ball) => {
              jumpToBall(ball.index);
              setSelectedBall(ball);
            }}
            selectedBallIndex={selectedBall?.index}
          />
        </section>

        {/* COLUMN 2: WATCH-ALONG CHAT (Pinned Qs + Chat Feed + Mood Meter) */}
        <section
          className={`lg:col-span-4 space-y-4 ${
            activeMobileTab === "chat" ? "block" : "hidden lg:block"
          }`}
        >
          <ChatFeed
            messages={messages}
            onSendMessage={sendUserMessage}
            topQuestions={topQuestions}
            source={pulseSource}
          />

          <MoodMeter currentMood={currentMood} moodHistory={moodHistory} />
        </section>

        {/* COLUMN 3: FOR YOU / CREATOR (Catch-up + Preferences + Creator Panel) */}
        <section
          className={`lg:col-span-4 space-y-4 ${
            activeMobileTab === "foryou" ? "block" : "hidden lg:block"
          }`}
        >
          {/* Preferences Selector (Fan Level & Language & View Perspective) */}
          <PreferencesSelector />

          {/* Conditional View: Fan View vs Creator View */}
          {viewMode === "fan" ? (
            <CatchupCard matchId={match.id} ballIndex={currentBallIndex} />
          ) : (
            <CreatorPanel
              tips={creatorTips}
              currentMoodLabel={currentMood.label}
              tension={currentMood.tension}
              hype={currentMood.hype}
              source={pulseSource}
            />
          )}
        </section>
      </main>

      {/* Explainer Modal ("Ye kya hua?") */}
      {selectedBall && (
        <ExplainerPopover
          ball={selectedBall}
          matchId={match.id}
          onClose={() => setSelectedBall(null)}
        />
      )}
    </div>
  );
}
