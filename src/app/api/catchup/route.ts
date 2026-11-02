import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CatchupRequestSchema } from "@/shared/schemas";
import { MatchData } from "@/shared/types";
import { cache } from "@/server/cache";
import { rateLimiter } from "@/server/rate-limit";
import { safeGenerate } from "@/server/ai/generate";
import { buildCatchupPrompt } from "@/server/ai/prompts/catchup";
import matchData from "@/data/matches/mm-vs-cc-final/match.json";
import fallbackData from "@/data/matches/mm-vs-cc-final/fallback.json";

const typedMatchData = matchData as unknown as MatchData;

const CatchupAISchema = z.object({
  summary: z.tuple([z.string(), z.string(), z.string()]),
  watchNext: z.string(),
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
    const parsed = CatchupRequestSchema.safeParse(body);
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
    const cacheKey = cache.makeKey(["catchup", matchId, ballIndex, prefs.fanLevel, prefs.language]);
    const cachedResult = cache.get<{
      summary: [string, string, string];
      watchNext: string;
      source: "ai" | "fallback";
    }>(cacheKey);

    if (cachedResult) {
      return NextResponse.json(cachedResult);
    }

    // Prepare match context
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

    // Pick fallback based on completed overs
    const catchupStages = fallbackData.catchup as Record<string, { summary: string[]; watchNext: string }>;
    let fallbackCatchup = catchupStages.powerplay;
    if (completedOvers >= 19) {
      fallbackCatchup = catchupStages.finalOver || catchupStages.climax;
    } else if (completedOvers >= 17) {
      fallbackCatchup = catchupStages.climax || catchupStages.deathOvers;
    } else if (completedOvers >= 14) {
      fallbackCatchup = catchupStages.deathOvers || catchupStages.rebuilding;
    } else if (completedOvers >= 10) {
      fallbackCatchup = catchupStages.rebuilding || catchupStages.crisis;
    } else if (completedOvers >= 6) {
      fallbackCatchup = catchupStages.crisis;
    } else if (completedOvers >= 2) {
      fallbackCatchup = catchupStages.earlyWickets || catchupStages.powerplay;
    } else {
      fallbackCatchup = catchupStages.powerplay;
    }

    const recentBalls = typedMatchData.balls.slice(Math.max(0, ballIndex - 8), ballIndex + 1);

    const prompt = buildCatchupPrompt({
      matchTitle: matchData.title,
      target: matchData.target,
      currentState: {
        score,
        wickets,
        overs: Number(`${completedOvers}.${ballsInOver}`),
      },
      ballsRemaining,
      runsNeeded,
      recentBalls,
      prefs,
    });

    const { data, source } = await safeGenerate({
      feature: "catchup",
      prompt,
      schema: CatchupAISchema,
      fallback: {
        summary: fallbackCatchup.summary as [string, string, string],
        watchNext: fallbackCatchup.watchNext,
      },
      matchId,
    });

    const responsePayload = {
      summary: data.summary,
      watchNext: data.watchNext,
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
