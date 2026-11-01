import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { RoomPulseRequestSchema } from "@/shared/schemas";
import { cache } from "@/server/cache";
import { rateLimiter } from "@/server/rate-limit";
import { safeGenerate } from "@/server/ai/generate";
import { buildRoomPulsePrompt } from "@/server/ai/prompts/room-pulse";
import matchData from "@/data/matches/mm-vs-cc-final/match.json";
import fallbackData from "@/data/matches/mm-vs-cc-final/fallback.json";

const RoomPulseAISchema = z.object({
  topQuestions: z
    .array(
      z.object({
        question: z.string(),
        askedBy: z.number().int().nonnegative(),
        answer: z.string(),
      })
    )
    .max(3),
  mood: z.object({
    tension: z.number().min(0).max(100),
    hype: z.number().min(0).max(100),
    anger: z.number().min(0).max(100),
    humour: z.number().min(0).max(100),
    label: z.string(),
  }),
  creatorTips: z.array(z.string()).length(3),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local-client";
    const rateCheck = rateLimiter.check(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please wait a minute.",
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = RoomPulseRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: parsed.error.issues.map((i) => i.message).join(", "),
          },
        },
        { status: 400 }
      );
    }

    const { matchId, overNumber, recentChat, prefs } = parsed.data;

    // Check Cache
    const cacheKey = cache.makeKey(["room-pulse", matchId, overNumber, prefs.fanLevel, prefs.language]);
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // Match situation calculation at this over
    const ballsElapsed = Math.min((overNumber - 14) * 6, matchData.balls.length);
    let score = matchData.startState.score;
    let wickets = matchData.startState.wickets;
    for (let i = 0; i < ballsElapsed; i++) {
      score += matchData.balls[i].runs + (matchData.balls[i].extras || 0);
      if (matchData.balls[i].wicket) wickets += 1;
    }
    const runsNeeded = Math.max(0, matchData.target - score);
    const ballsRemaining = Math.max(0, 120 - (14 * 6 + ballsElapsed));

    // Fallback extraction
    const overKey = String(overNumber);
    const roomPulseFallbacks = fallbackData.roomPulse as Record<string, any>;
    const fallbackOver =
      roomPulseFallbacks[overKey] ||
      roomPulseFallbacks["17"] ||
      roomPulseFallbacks["15"];

    const prompt = buildRoomPulsePrompt({
      matchTitle: matchData.title,
      overNumber,
      scoreStr: `${score}/${wickets}`,
      equationStr: `${runsNeeded} needed off ${ballsRemaining} balls`,
      recentChat: recentChat.slice(-15),
      prefs,
    });

    const { data, source } = await safeGenerate({
      feature: "room-pulse",
      prompt,
      schema: RoomPulseAISchema,
      fallback: {
        topQuestions: fallbackOver.topQuestions,
        mood: fallbackOver.mood,
        creatorTips: fallbackOver.creatorTips,
      },
      matchId,
    });

    const responsePayload = {
      ...data,
      source,
    };

    cache.set(cacheKey, responsePayload);

    return NextResponse.json(responsePayload);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
