interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private maxEntries = 500;
  private defaultTTL = 1000 * 60 * 30; // 30 minutes

  public makeKey(parts: (string | number | undefined)[]): string {
    return parts.filter((p) => p !== undefined).join(":");
  }

  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public set<T>(key: string, value: T): void {
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value;
      if (oldestKey) this.store.delete(oldestKey);
    }
    this.store.set(key, { value, timestamp: Date.now() });
  }

  public clear(): void {
    this.store.clear();
  }
}

export const cache = new MemoryCache();
