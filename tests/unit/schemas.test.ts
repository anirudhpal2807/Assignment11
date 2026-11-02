import { describe, it, expect } from "vitest";
import matchData from "@/data/matches/mm-vs-cc-final/match.json";
import chatData from "@/data/matches/mm-vs-cc-final/chat.json";
import { MatchDataSchema, ChatMessageSchema } from "@/shared/schemas";

describe("Data and Schemas Validation", () => {
  it("validates mm-vs-cc-final match.json", () => {
    const result = MatchDataSchema.safeParse(matchData);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.error(result.error);
    }
    expect(matchData.balls.length).toBe(120);
  });

  it("validates chat.json messages", () => {
    expect(chatData.length).toBeGreaterThan(0);
    for (const msg of chatData) {
      const result = ChatMessageSchema.safeParse(msg);
      expect(result.success).toBe(true);
      if (!result.success) {
        console.error(result.error);
      }
    }
  });

  it("verifies DRS controversy exists at over 16.2", () => {
    const drsBall = matchData.balls.find((b) => b.event === "DRS_NOT_TAKEN");
    expect(drsBall).toBeDefined();
    expect(drsBall?.over).toBe(16.2);
  });

  it("verifies dropped catch exists at over 17.4", () => {
    const droppedBall = matchData.balls.find((b) => b.event === "DROPPED_CATCH");
    expect(droppedBall).toBeDefined();
    expect(droppedBall?.over).toBe(17.4);
  });
});

