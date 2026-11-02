"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/shared/types";
import { PinnedAnswers } from "./PinnedAnswers";
import { Send, MessageCircle } from "lucide-react";

interface ChatFeedProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  topQuestions: { question: string; askedBy: number; answer: string }[];
  source?: "ai" | "fallback";
}

export function ChatFeed({
  messages,
  onSendMessage,
  topQuestions,
  source = "fallback",
}: ChatFeedProps) {
  const [inputText, setInputText] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ONLY internal chat box, never the entire window
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case "question":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "analysis":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "banter":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-700/30 text-slate-400 border-slate-700/50";
    }
  };

  return (
    <div className="bg-stadium-800/80 border border-stadium-border/60 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-stadium-border/60 flex items-center justify-between bg-stadium-900/50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold text-white tracking-wide uppercase">
            Live Watch-Along Room
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>~95.4k fans watching (IND vs PAK)</span>
        </div>
      </div>

      {/* Pinned Top Questions Card */}
      <div className="p-3 border-b border-stadium-border/40 bg-stadium-900/30">
        <PinnedAnswers questions={topQuestions} source={source} />
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 space-y-2.5 scroll-smooth"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col text-xs p-2 rounded-lg transition-all ${
              msg.user.startsWith("You")
                ? "bg-blue-600/20 border border-blue-500/40 ml-4"
                : "bg-stadium-900/40 border border-stadium-border/30 hover:border-stadium-border/60"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-300 text-[11px]">
                {msg.user}
              </span>
              {msg.type && (
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-mono ${getBadgeColor(
                    msg.type
                  )}`}
                >
                  {msg.type}
                </span>
              )}
            </div>
            <p className="text-slate-100 text-xs break-words">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Send Message Input */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-stadium-border/60 bg-stadium-900/60 flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question or react in chat..."
          className="flex-1 bg-stadium-800 border border-stadium-border/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl transition-all flex items-center justify-center shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
