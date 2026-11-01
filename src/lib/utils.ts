import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOvers(overs: number): string {
  const rounded = Math.round(overs * 10) / 10;
  return rounded.toFixed(1);
}

export function calculateRunRate(runs: number, overs: number): number {
  if (overs <= 0) return 0;
  const fullOvers = Math.floor(overs);
  const balls = Math.round((overs - fullOvers) * 10);
  const totalBalls = fullOvers * 6 + balls;
  if (totalBalls <= 0) return 0;
  return Math.round((runs / totalBalls) * 6 * 100) / 100;
}

export function calculateRequiredRate(target: number, currentScore: number, remainingBalls: number): number {
  if (remainingBalls <= 0) return 0;
  const runsNeeded = Math.max(0, target - currentScore);
  return Math.round((runsNeeded / remainingBalls) * 6 * 100) / 100;
}
