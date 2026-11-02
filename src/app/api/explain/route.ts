import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ExplainRequestSchema } from "@/shared/schemas";
import { MatchData } from "@/shared/types";
import { cache } from "@/server/cache";
import { rateLimiter } from "@/server/rate-limit";
import { safeGenerate } from "@/server/ai/generate";
import { buildExplainPrompt } from "@/server/ai/prompts/explain";
import matchData from "@/data/matches/mm-vs-cc-final/match.json";
import fallbackData from "@/data/matches/mm-vs-cc-final/fallback.json";

const typedMatchData = matchData as unknown as MatchData;

const ExplainAISchema = z.object({
  explanation: z.string().min(1),
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
            message: "Too many requests. Please slow down.",
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ExplainRequestSchema.safeParse(body);
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

    const { matchId, ballIndex, prefs } = parsed.data;

    // Check Cache
    const cacheKey = cache.makeKey(["explain", matchId, ballIndex, prefs.fanLevel, prefs.language]);
    const cachedResult = cache.get<{ explanation: string; source: "ai" | "fallback" }>(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // Prepare ball & situation from match data
    const ball = typedMatchData.balls[ballIndex] || typedMatchData.balls[0];
    let score = matchData.startState.score;
    let wickets = matchData.startState.wickets;
    for (let i = 0; i <= ballIndex; i++) {
      score += matchData.balls[i].runs + (matchData.balls[i].extras || 0);
      if (matchData.balls[i].wicket) wickets += 1;
    }
    const startBalls = (matchData.startOver || 0) * 6;
    const totalBallsBowled = startBalls + (ballIndex + 1);
    const completedOvers = Math.floor(totalBallsBowled / 6);
    const ballsInOver = totalBallsBowled % 6;
    const ballsRemaining = Math.max(0, 120 - totalBallsBowled);
    const runsNeeded = Math.max(0, matchData.target - score);

    // Fallback extraction
    const ballKey = String(ballIndex);
    const fallbackSection =
      (fallbackData.explain as Record<string, any>)[ballKey] ||
      (ball.event === "DRS_NOT_TAKEN" ? (fallbackData.explain as any)["13"] : undefined) ||
      (ball.event === "DROPPED_CATCH" ? (fallbackData.explain as any)["21"] : undefined) ||
      (ball.event === "NO_BALL" ? (fallbackData.explain as any)["33"] : undefined) ||
      (ball.event === "SIX" ? (fallbackData.explain as any)["28"] : undefined);
    const fallbackExplanation =
      fallbackSection?.[prefs.fanLevel]?.[prefs.language] ||
      `Ball ${ball.over}: ${ball.bowler} to ${ball.batter}. ${ball.runs} runs scored. ${ball.commentary}`;

    const prompt = buildExplainPrompt({
      matchTitle: matchData.title,
      target: matchData.target,
      ball,
      situation: {
        score,
        wickets,
        overs: Number(`${completedOvers}.${ballsInOver}`),
      },
      runsNeeded,
      ballsRemaining,
      prefs,
    });

    const { data, source } = await safeGenerate({
      feature: "explain",
      prompt,
      schema: ExplainAISchema,
      fallback: { explanation: fallbackExplanation },
      matchId,
    });

    const responsePayload = {
      explanation: data.explanation,
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
