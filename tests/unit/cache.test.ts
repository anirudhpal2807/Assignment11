import { describe, it, expect, beforeEach } from "vitest";
import { cache } from "@/server/cache";

describe("In-Memory Cache", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("stores and retrieves cached values using composite keys", () => {
    const key = cache.makeKey(["explain", "mm-vs-cc-final", 13, "regular", "hinglish"]);
    expect(key).toBe("explain:mm-vs-cc-final:13:regular:hinglish");

    cache.set(key, { explanation: "Clear LBW test" });
    const cached = cache.get<{ explanation: string }>(key);
    expect(cached).toBeDefined();
    expect(cached?.explanation).toBe("Clear LBW test");
  });

  it("returns null for non-existent keys", () => {
    const nonExistent = cache.get("random:key");
    expect(nonExistent).toBeNull();
  });
});
