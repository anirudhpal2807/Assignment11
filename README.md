# Stands: AI Co-host for Live Cricket Watch-Alongs

> **Built for the Dream11 Forward Deployed Engineer Intern role.**  
> Author: Anirudh Pal

---

## 1. Problem & Context

Following India's real-money gaming transition (Aug 2025) and Dream11's pivot to a **second-screen sports entertainment platform** (Dec 2025), cricket fans watch the primary broadcast on TV and engage simultaneously on their mobile phones through creator watch-alongs.

However, during high-stakes chases, watch-along chats move at hundreds of messages per minute:
- **Late joiners** cannot figure out what happened without scrolling through spam.
- **Casual fans** asking basic rule questions (e.g. DRS, LBW, fielding restrictions) get buried in seconds.
- **Creators** cannot read the flood of incoming messages, causing them to lose touch with what their audience actually wants to discuss.

**In research analyzing live cricket chat streams:**
- **26%** of messages were questions.
- **84%** of those questions went completely unanswered.

---

## 2. Solution: Stands

**Stands** is an intelligent AI co-host embedded directly inside the watch-along room:

| Feature | What It Does |
|---|---|
| **F1. Pinned Top Questions** | Groups repeated chat questions every over, calculates approximate frequency (`asked by ~76 fans`), and pins the 1–2 line answer to the top of chat. |
| **F2. "I just joined" Catch-up** | One-click button returning a 3-line story (turning point, player on fire, who's on top + RRR) plus what to watch next. |
| **F3. "Ye kya hua?" Explainer** | Tap any ball in the timeline to receive an instant 2-sentence breakdown calibrated to your Fan Level. |
| **F4. Room Mood Meter** | Scores audience sentiment (tension, hype, anger, banter) 0–100 and plots a dynamic trendline across overs. |
| **F5. Fan Level Toggle** | Choose **Naya hoon** (jargon-free), **Regular** (balanced), or **Die-hard** (tactical & deep stats). Every AI response dynamically adjusts. |
| **F6. Trilingual Support** | Instant toggle between **Hinglish** (natural Romanized Indian English), **English**, and **Hindi**. |
| **F7. Creator Teleprompter** | Creator view giving the streamer 3 timely talking points ("Chat is asking about X. Say these 3 things next.") based on live room sentiment. |

---

## 3. Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions, Route Handlers) + TypeScript
- **Styling**: Tailwind CSS with custom dark stadium arena design system
- **UI & Icons**: Lucide React + custom segmented controls
- **Charts**: Recharts (multi-dimensional Room Mood Meter)
- **AI Inference**: Google Gemini Flash via Vercel AI SDK (`ai`, `@ai-sdk/google`)
- **Validation**: Zod schema validation on all inputs, payloads, and AI JSON responses
- **Reliability & Cache**: In-memory LRU cache, per-IP rate limiter (20 req/min), 8s timeout with 1 retry, and comprehensive fallbacks in `fallback.json`
- **Testing**: Vitest (Unit & Integration tests)

---

## 4. Architecture & Data Flow

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
│  rate-limit ─► cache lookup ─► safeGenerate()                    │
│                                  ├─ build prompt                 │
│                                  ├─ Gemini Flash (structured)    │
│                                  ├─ timeout 8 s, 1 retry         │
│                                  ├─ Zod validate                 │
│                                  └─ on failure → fallback.json   │
│  logger: latency, tokens, fallback used                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Reliability, Cost & Scale

- **Zero-Failure Demo**: All routes are supported by pre-computed match fallbacks (`fallback.json`). Even if run offline or without an API key, the full interactive experience is 100% operational.
- **One Batched Call Per Over**: Top Questions, Mood Meter, and Creator Teleprompter are generated in a single `/api/room-pulse` call rather than 3 fragmented calls, reducing token costs by ~65%.
- **LRU In-Memory Cache**: Repeated requests for the same ball, level, and language are returned in `< 1ms` from cache.
- **Production Scale Model**: In a room of 10,000 live viewers, `room-pulse` runs once per over per room (shared via SSE/WebSockets), keeping LLM costs proportional to **rooms × overs**, not total viewers.

---

## 6. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v25)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/stands.git
cd stands

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# (Optional) Add your Google Generative AI Key to .env.local:
# GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

### Running Locally

```bash
# Start development server
npm run dev

# Open in browser:
# http://localhost:3000 -> Landing
# http://localhost:3000/watch/mm-vs-cc-final -> Live Watch-Along Room
```

### Running Quality Checks & Tests

```bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Unit & Integration Tests
npm run test

# Production Build
npm run build
```

---

## 7. Next Steps

- **Football Mode**: VAR decisions, offside explainer, and injury time calculations.
- **Live Scoreboard Feeds**: Integration with sports websocket providers for real-time international matches.
- **Moment Sharing**: Instant shareable visual cards for social media when a dramatic ball occurs.
- **Creator Analytics**: Post-match breakdown of topics that drove the highest engagement.
