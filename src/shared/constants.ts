import { UserPrefs } from "./types";

export const DEFAULT_PREFS: UserPrefs = {
  fanLevel: "regular",
  language: "hinglish",
};

export const DEFAULT_MATCH_ID = "mm-vs-cc-final";

export const SIMULATOR_SPEEDS = [
  { label: "1x", value: 1000 },
  { label: "2x", value: 500 },
  { label: "4x", value: 250 },
  { label: "Pause", value: 0 },
] as const;
