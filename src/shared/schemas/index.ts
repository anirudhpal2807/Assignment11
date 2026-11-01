import { z } from "zod";

export const FanLevelSchema = z.enum(["naya", "regular", "diehard"]);
export const LanguageSchema = z.enum(["hinglish", "english", "hindi"]);

export const UserPrefsSchema = z.object({
  fanLevel: FanLevelSchema,
  language: LanguageSchema,
});

export const BallEventSchema = z.enum([
  "DOT",
  "RUN",
  "FOUR",
  "SIX",
  "WICKET",
  "WIDE",
  "NO_BALL",
  "DRS_NOT_TAKEN",
  "DROPPED_CATCH",
]);

export const BallSchema = z.object({
  index: z.number().int().nonnegative(),
  over: z.number(),
  bowler: z.string().min(1),
  batter: z.string().min(1),
  runs: z.number().int().nonnegative(),
  extras: z.number().int().nullable(),
  wicket: z
    .object({
      playerOut: z.string(),
      kind: z.enum(["bowled", "caught", "lbw", "run_out", "stumped"]),
      fielder: z.string().optional(),
    })
    .nullable(),
  event: BallEventSchema,
  commentary: z.string(),
  tags: z.array(z.string()),
});

export const MatchStateSchema = z.object({
  score: z.number().int().nonnegative(),
  wickets: z.number().int().nonnegative().max(10),
  overs: z.number().nonnegative(),
});

export const MatchDataSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  format: z.enum(["T20", "ODI"]),
  battingFirst: z.object({
    team: z.string().min(1),
    score: z.number().int().nonnegative(),
    wickets: z.number().int().nonnegative().max(10),
    overs: z.number().nonnegative(),
  }),
  chasing: z.string().min(1),
  target: z.number().int().positive(),
  startOver: z.number().int().nonnegative(),
  startState: MatchStateSchema,
  players: z.object({
    batters: z.array(z.string().min(1)),
    bowlers: z.array(z.string().min(1)),
  }),
  balls: z.array(BallSchema),
});

export const ChatMessageSchema = z.object({
  id: z.string(),
  ballIndex: z.number().int().nonnegative(),
  user: z.string().min(1),
  text: z.string().min(1),
  type: z.enum(["question", "reaction", "banter", "analysis"]).optional(),
  timestamp: z.number().optional(),
});

export const CatchupRequestSchema = z.object({
  matchId: z.string().min(1),
  ballIndex: z.number().int().nonnegative(),
  prefs: UserPrefsSchema,
});

export const CatchupResponseSchema = z.object({
  summary: z.tuple([z.string(), z.string(), z.string()]),
  watchNext: z.string(),
  source: z.enum(["ai", "fallback"]),
});

export const ExplainRequestSchema = z.object({
  matchId: z.string().min(1),
  ballIndex: z.number().int().nonnegative(),
  prefs: UserPrefsSchema,
});

export const ExplainResponseSchema = z.object({
  explanation: z.string().min(1),
  source: z.enum(["ai", "fallback"]),
});

export const RoomPulseRequestSchema = z.object({
  matchId: z.string().min(1),
  overNumber: z.number(),
  recentChat: z.array(
    z.object({
      user: z.string(),
      text: z.string(),
    })
  ),
  prefs: UserPrefsSchema,
});

export const RoomPulseResponseSchema = z.object({
  topQuestions: z
    .array(
      z.object({
        question: z.string(),
        askedBy: z.number().int().nonnegative(),
        answer: z.string(),
      })
    )
    .max(3),
  mood: z.object({
    tension: z.number().min(0).max(100),
    hype: z.number().min(0).max(100),
    anger: z.number().min(0).max(100),
    humour: z.number().min(0).max(100),
    label: z.string(),
  }),
  creatorTips: z.array(z.string()).length(3),
  source: z.enum(["ai", "fallback"]),
});
