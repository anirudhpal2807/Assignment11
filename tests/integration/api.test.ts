import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as healthHandler } from "@/app/api/health/route";
import { POST as explainHandler } from "@/app/api/explain/route";
import { POST as catchupHandler } from "@/app/api/catchup/route";
import { POST as roomPulseHandler } from "@/app/api/room-pulse/route";

describe("API Routes Integration Tests", () => {
  it("GET /api/health returns ok: true", async () => {
    const res = await healthHandler();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.model).toBeDefined();
  });

  it("POST /api/explain returns explanation for DRS ball", async () => {
    const req = new NextRequest("http://localhost:3000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: "mm-vs-cc-final",
        ballIndex: 13,
        prefs: {
          fanLevel: "regular",
          language: "hinglish",
        },
      }),
    });

    const res = await explainHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.explanation).toBeDefined();
    expect(data.explanation.length).toBeGreaterThan(10);
    expect(["ai", "fallback"]).toContain(data.source);
  });

  it("POST /api/catchup returns 3-line summary & watchNext", async () => {
    const req = new NextRequest("http://localhost:3000/api/catchup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: "mm-vs-cc-final",
        ballIndex: 18,
        prefs: {
          fanLevel: "regular",
          language: "hinglish",
        },
      }),
    });

    const res = await catchupHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBeDefined();
    expect(Array.isArray(data.summary)).toBe(true);
    expect(data.summary.length).toBe(3);
    expect(data.watchNext).toBeDefined();
    expect(["ai", "fallback"]).toContain(data.source);
  });

  it("POST /api/room-pulse returns top questions, mood, and creator tips", async () => {
    const req = new NextRequest("http://localhost:3000/api/room-pulse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId: "mm-vs-cc-final",
        overNumber: 17,
        recentChat: [
          { user: "fan1", text: "DRS kyun nahi liya?" },
          { user: "fan2", text: "Match fas gaya!" },
        ],
        prefs: {
          fanLevel: "regular",
          language: "hinglish",
        },
      }),
    });

    const res = await roomPulseHandler(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.topQuestions).toBeDefined();
    expect(data.mood).toBeDefined();
    expect(data.mood.label).toBeDefined();
    expect(data.creatorTips).toBeDefined();
    expect(data.creatorTips.length).toBe(3);
    expect(["ai", "fallback"]).toContain(data.source);
  });

  it("POST /api/explain returns 400 on invalid request payload", async () => {
    const req = new NextRequest("http://localhost:3000/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invalid: true,
      }),
    });

    const res = await explainHandler(req);
    expect(res.status).toBe(400);
  });
});
