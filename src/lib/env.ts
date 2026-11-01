import { z } from "zod";

const EnvSchema = z.object({
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-1.5-flash"),
  RATE_LIMIT_PER_MIN: z
    .string()
    .default("20")
    .transform((val) => parseInt(val, 10)),
  AI_TIMEOUT_MS: z
    .string()
    .default("8000")
    .transform((val) => parseInt(val, 10)),
});

const parsed = EnvSchema.safeParse(process.env);

export const env = {
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  GEMINI_MODEL: (parsed.success ? parsed.data.GEMINI_MODEL : undefined) || process.env.GEMINI_MODEL || "gemini-1.5-flash",
  RATE_LIMIT_PER_MIN: parsed.success ? parsed.data.RATE_LIMIT_PER_MIN : 20,
  AI_TIMEOUT_MS: parsed.success ? parsed.data.AI_TIMEOUT_MS : 8000,
};
