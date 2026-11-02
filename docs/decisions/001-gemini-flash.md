# ADR 001: Choice of Google Gemini Flash for Real-Time Inference

## Context
A live cricket watch-along generates hundreds of chat reactions per minute, requiring fast token generation, structured JSON outputs, Hinglish fluency, and low latency (< 1.5s).

## Decision
We chose **Google Gemini Flash** via Vercel AI SDK (`@ai-sdk/google`).

## Consequences
- **Ultra-low latency**: Sub-second TTFT (Time-To-First-Token) suitable for real-time second-screen experience.
- **Cost-effective**: Generous free tier and economical per-million token pricing fits high-volume watch-alongs.
- **Native Structured Outputs**: Flawless schema adherence with Zod, eliminating fragile regex parsing.
- **Hinglish Fluency**: Superior understanding of casual Romanized Indian colloquialisms and cricket slang.

