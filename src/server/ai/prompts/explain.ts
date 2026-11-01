import { Ball, MatchState, UserPrefs } from "@/shared/types";

export function buildExplainPrompt(params: {
  matchTitle: string;
  target: number;
  ball: Ball;
  situation: MatchState;
  runsNeeded: number;
  ballsRemaining: number;
  prefs: UserPrefs;
}): string {
  const {
    matchTitle,
    target,
    ball,
    situation,
    runsNeeded,
    ballsRemaining,
    prefs,
  } = params;

  return `You are the co-host of a live cricket watch-along room for "${matchTitle}".
Audience level: ${prefs.fanLevel}
  - naya: explain like to a first-time viewer, no jargon
  - regular: normal fan, light stats
  - diehard: tactical, numbers, sharp
Language: ${prefs.language} (hinglish = natural Roman-script Hindi-English mix)

Context:
Target: ${target}. Chase score at this moment: ${situation.score}/${situation.wickets} (${situation.overs} ov).
Runs Needed: ${runsNeeded} runs from ${ballsRemaining} balls.

Ball details:
- Over: ${ball.over}
- Bowler: ${ball.bowler}
- Batter: ${ball.batter}
- Runs: ${ball.runs}
- Event: ${ball.event}
- Tags: ${ball.tags.join(", ")}
- Commentary: "${ball.commentary}"

Use only facts from the match data provided. Never invent players, scores or events.
No betting, odds or money talk.

Task:
Explain what happened on this ball and why it matters in the chase, in at most 2 sentences. Match the fan level and language precisely.

Output ONLY valid JSON:
{
  "explanation": "2 sentences here"
}`;
}
