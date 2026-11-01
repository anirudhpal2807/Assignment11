# Architecture — Stands: AI Co-host for Live Cricket Watch-Alongs

## System Overview

Stands sits as an intelligent layer inside a live cricket watch-along broadcast room, connecting high-velocity chat engagement with live game context.

```
┌──────────────────────────── Browser ────────────────────────────┐
│  useMatchSimulator  ──► current ball/over (speed: 1x / 2x / 4x) │
│        │                                                         │
│        ├─► Scorecard + BallTimeline ──(tap)──► /api/explain      │
│        ├─► ChatFeed (chat.json synced to ball)                   │
│        ├─► on over end ─────────────────────► /api/room-pulse    │
│        └─► "I just joined" ─────────────────► /api/catchup       │
│  PreferencesContext (fanLevel, language) added to every request  │
└──────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────── Next.js API (Vercel) ───────────────────┐
│  rate-limit ─► cache lookup ─► generate()                        │
│                                  ├─ build prompt                 │
│                                  ├─ Gemini Flash (structured)    │
│                                  ├─ timeout 8 s, 1 retry         │
│                                  ├─ Zod validate                 │
│                                  └─ on failure → fallback.json   │
│  logger: latency, tokens, fallback used                          │
└──────────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

1. **Batched Room Pulse**: One single batched call per over (`/api/room-pulse`) synthesizes the top 3 fan questions, analyzes multi-dimensional room sentiment (tension, hype, anger, humour), and prepares the 3 creator teleprompter cues. This reduces LLM token consumption by ~70% and avoids rate limits.
2. **Context-Sensitive Explanations**: Tapping any ball on the timeline invokes `/api/explain`. The prompt receives the ball commentary, bowler/batter context, and the fan preference level (`naya`, `regular`, `diehard`) in their preferred language (`hinglish`, `english`, `hindi`).
3. **Resilient Fallback Design**: Every AI route is backed by curated fallback data in `fallback.json`. If an API key is absent, network drops, or LLM response times out (> 8s), the application transparently serves verified match commentary without breaking the user experience.
4. **Client-Driven Simulation**: The match simulator runs entirely client-side using a clean tick model, allowing interactive speed adjustment (1x, 2x, 4x, pause) and forward/backward time-travel without server overhead.
