"use client";

import { useMemo, useState } from "react";
import { ChatMessage } from "@/shared/types";
import defaultChatData from "@/data/matches/mm-vs-cc-final/chat.json";

export function useChatStream(currentBallIndex: number) {
  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);

  // Messages synced with current ball
  const visibleMessages = useMemo(() => {
    const rawMatches = (defaultChatData as unknown as ChatMessage[]).filter(
      (msg) => msg.ballIndex <= currentBallIndex
    );
    // Combine with any user typed messages
    const all = [...rawMatches, ...userMessages].sort((a, b) => {
      if (a.ballIndex !== b.ballIndex) return a.ballIndex - b.ballIndex;
      return (a.timestamp || 0) - (b.timestamp || 0);
    });
    return all;
  }, [currentBallIndex, userMessages]);

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      ballIndex: currentBallIndex,
      user: "You (Fan)",
      text: text.trim(),
      type: text.includes("?") ? "question" : "reaction",
      timestamp: Date.now(),
    };
    setUserMessages((prev) => [...prev, newMsg]);
  };

  // Extract recent chat for room-pulse prompt
  const recentChatForPrompt = useMemo(() => {
    return visibleMessages.slice(-20).map((m) => ({
      user: m.user,
      text: m.text,
    }));
  }, [visibleMessages]);

  return {
    messages: visibleMessages,
    sendUserMessage,
    recentChatForPrompt,
  };
}
