export interface LogEvent {
  feature: "catchup" | "explain" | "room-pulse" | "health";
  matchId?: string;
  source: "ai" | "fallback" | "cache";
  durationMs: number;
  tokensEstimate?: number;
  status: "success" | "error";
  error?: string;
}

class StandsLogger {
  private logs: LogEvent[] = [];

  public log(event: LogEvent): void {
    this.logs.push(event);
    if (this.logs.length > 500) {
      this.logs.shift();
    }

    const badge = event.source === "ai" ? "🤖 AI" : event.source === "cache" ? "⚡ CACHE" : "🛡️ FALLBACK";
    console.log(
      `[Stands] [${event.feature.toUpperCase()}] ${badge} - ${event.durationMs}ms - Status: ${event.status}${
        event.error ? ` - Error: ${event.error}` : ""
      }`
    );
  }

  public getRecentLogs(): LogEvent[] {
    return [...this.logs];
  }
}

export const logger = new StandsLogger();

