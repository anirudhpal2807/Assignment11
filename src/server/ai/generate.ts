import { generateObject } from "ai";
import { z } from "zod";
import { getGeminiModel, isGeminiConfigured } from "./client";
import { env } from "@/lib/env";
import { logger } from "../logger";

interface SafeGenerateOptions<T> {
  feature: "catchup" | "explain" | "room-pulse";
  prompt: string;
  schema: z.ZodType<T>;
  fallback: T;
  matchId?: string;
}

export async function safeGenerate<T>({
  feature,
  prompt,
  schema,
  fallback,
  matchId,
}: SafeGenerateOptions<T>): Promise<{ data: T; source: "ai" | "fallback" }> {
  const startTime = Date.now();

  // If Gemini API is not configured, immediately use fallback
  if (!isGeminiConfigured) {
    logger.log({
      feature,
      matchId,
      source: "fallback",
      durationMs: Date.now() - startTime,
      status: "success",
    });
    return { data: fallback, source: "fallback" };
  }

  // Attempt generation with 1 retry and timeout
  const attempt = async () => {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`AI generation timed out after ${env.AI_TIMEOUT_MS}ms`)),
        env.AI_TIMEOUT_MS
      )
    );

    const generatePromise = generateObject({
      model: getGeminiModel(),
      schema,
      prompt,
    });

    const result = await Promise.race([generatePromise, timeoutPromise]);
    return result.object;
  };

  try {
    const data = await attempt();
    logger.log({
      feature,
      matchId,
      source: "ai",
      durationMs: Date.now() - startTime,
      status: "success",
    });
    return { data, source: "ai" };
  } catch (err: unknown) {
    const firstError = err instanceof Error ? err.message : String(err);
    console.warn(`[Stands] Attempt 1 failed for ${feature}: ${firstError}. Retrying...`);

    try {
      // 1 Retry
      const retryData = await attempt();
      logger.log({
        feature,
        matchId,
        source: "ai",
        durationMs: Date.now() - startTime,
        status: "success",
      });
      return { data: retryData, source: "ai" };
    } catch (retryErr: unknown) {
      const errorMsg = retryErr instanceof Error ? retryErr.message : String(retryErr);
      logger.log({
        feature,
        matchId,
        source: "fallback",
        durationMs: Date.now() - startTime,
        status: "error",
        error: errorMsg,
      });
      return { data: fallback, source: "fallback" };
    }
  }
}
