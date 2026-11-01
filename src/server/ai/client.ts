import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/lib/env";

export const isGeminiConfigured = Boolean(
  env.GOOGLE_GENERATIVE_AI_API_KEY &&
    env.GOOGLE_GENERATIVE_AI_API_KEY.trim().length > 0 &&
    !env.GOOGLE_GENERATIVE_AI_API_KEY.includes("your-api-key")
);

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY || "missing-key",
});

export const getGeminiModel = () => {
  return google(env.GEMINI_MODEL || "gemini-1.5-flash");
};
