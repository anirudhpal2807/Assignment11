import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { isGeminiConfigured } from "@/server/ai/client";

export async function GET() {
  return NextResponse.json({
    ok: true,
    model: env.GEMINI_MODEL,
    geminiReachable: isGeminiConfigured,
    timestamp: new Date().toISOString(),
  });
}

