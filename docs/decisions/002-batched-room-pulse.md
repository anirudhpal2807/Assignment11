# ADR 002: Batched Room Pulse Strategy

## Context
Features F1 (Top Questions Answered), F4 (Room Mood Meter), and F7 (Creator Teleprompter) all need recent chat analysis and match context every over. Making 3 independent LLM calls per over creates redundant prompt tokens, multiplies latency, and risks rate limiting.

## Decision
We combined F1, F4, and F7 into a single unified `/api/room-pulse` call executed at the end of each over.

## Consequences
- **Token Efficiency**: 1 call instead of 3 saves ~65% input tokens per over.
- **Synchronized State**: The Mood Meter, Top Questions, and Creator Tips always share the exact same contextual snapshot.
- **Scale**: In production, Room Pulse executes once per room per over (shared across 10,000+ simultaneous viewers) rather than per user, making LLM costs scale with rooms × overs.
