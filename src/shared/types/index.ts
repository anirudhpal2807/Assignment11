export type FanLevel = "naya" | "regular" | "diehard";
export type Language = "hinglish" | "english" | "hindi";

export interface UserPrefs {
  fanLevel: FanLevel;
  language: Language;
}

export type BallEvent =
  | "DOT"
  | "RUN"
  | "FOUR"
  | "SIX"
  | "WICKET"
  | "WIDE"
  | "NO_BALL"
  | "DRS_NOT_TAKEN"
  | "DROPPED_CATCH";

export interface Ball {
  index: number;
  over: number; // e.g. 14.1
  bowler: string;
  batter: string;
  runs: number;
  extras: number | null;
  wicket: {
    playerOut: string;
    kind: "bowled" | "caught" | "lbw" | "run_out" | "stumped";
    fielder?: string;
  } | null;
  event: BallEvent;
  commentary: string;
  tags: string[];
}

export interface MatchState {
  score: number;
  wickets: number;
  overs: number; // e.g. 13.6
}

export interface MatchData {
  id: string;
  title: string;
  format: "T20" | "ODI";
  battingFirst: {
    team: string;
    score: number;
    wickets: number;
    overs: number;
  };
  chasing: string;
  target: number;
  startOver: number;
  startState: MatchState;
  players: {
    batters: string[];
    bowlers: string[];
  };
  balls: Ball[];
}

export interface ChatMessage {
  id: string;
  ballIndex: number;
  user: string;
  text: string;
  type?: "question" | "reaction" | "banter" | "analysis";
  timestamp?: number;
}

export interface CatchupResponse {
  summary: [string, string, string];
  watchNext: string;
  source: "ai" | "fallback";
}

export interface ExplainResponse {
  explanation: string;
  source: "ai" | "fallback";
}

export interface RoomPulseResponse {
  topQuestions: {
    question: string;
    askedBy: number;
    answer: string;
  }[];
  mood: {
    tension: number;
    hype: number;
    anger: number;
    humour: number;
    label: string;
  };
  creatorTips: string[];
  source: "ai" | "fallback";
}

export interface HealthResponse {
  ok: boolean;
  model: string;
  geminiReachable: boolean;
}

