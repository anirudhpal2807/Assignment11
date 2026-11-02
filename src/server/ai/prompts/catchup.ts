import { Ball, MatchState, UserPrefs } from "@/shared/types";

export function buildCatchupPrompt(params: {
  matchTitle: string;
  target: number;
  currentState: MatchState;
  ballsRemaining: number;
  runsNeeded: number;
  recentBalls: Ball[];
  prefs: UserPrefs;
}): string {
  const {
    matchTitle,
    target,
    currentState,
    ballsRemaining,
    runsNeeded,
    recentBalls,
    prefs,
  } = params;

  return `You are the co-host of a live cricket watch-along room for "${matchTitle}".
Target: ${target}
Current State: ${currentState.score}/${currentState.wickets} in ${currentState.overs} overs.
Runs Needed: ${runsNeeded} off ${ballsRemaining} balls.

Audience level: ${prefs.fanLevel}
  - naya: explain like to a first-time viewer, no jargon
  - regular: normal fan, light stats
  - diehard: tactical, numbers, sharp
Language: ${prefs.language} (hinglish = natural Roman-script Hindi-English mix)

CRITICAL REAL-TIME INSTRUCTION:
- You are reporting LIVE at over ${currentState.overs}.
- You MUST ONLY summarize events that have ACTUALLY OCCURRED up to over ${currentState.overs}.
- DO NOT mention any future events from this historic match (for example, if over is 0.1 to 5.0, DO NOT mention later wickets, 31/4 collapse, Hardik-Kohli partnership, Haris Rauf 19th over, or death overs).
- If the match is in the opening overs (over 0-2), focus strictly on the target (${target}), opening bowlers (Shaheen Afridi, Naseem Shah), and openers (KL Rahul, Rohit Sharma).
- Use only facts from the match data provided below. Never invent players, scores or events.
- No betting, odds or money talk.

Recent drama / events up to this ball:
${recentBalls
  .map(
    (b) =>
      `- Over ${b.over}: ${b.bowler} to ${b.batter}, ${b.runs} runs, Event: ${b.event}. ${b.commentary}`
  )
  .join("\n")}

Task:
Write a catch-up summary for a late-joining fan at this exact point in the match.
1. "summary": Exactly 3 short lines:
   - Line 1: The key situation or drama up to this point.
   - Line 2: Who is bowling or batting right now.
   - Line 3: Current match equation and state (runs needed vs balls remaining).
2. "watchNext": One short exciting sentence on what to watch next in the immediate upcoming deliveries.

Output ONLY valid JSON matching this structure:
{
  "summary": ["line 1", "line 2", "line 3"],
  "watchNext": "sentence"
}`;
}

