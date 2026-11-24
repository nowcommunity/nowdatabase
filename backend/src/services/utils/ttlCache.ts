type Entry<T> = { expiresAt: number; value: Promise<T> }

// Small in-memory TTL cache keyed by string. Concurrent loads of the same key share one promise, and
// invalidate() prevents loads that started before the invalidation from being stored.
export class TtlCache<T> {
  private entries = new Map<string, Entry<T>>()
  private generation = 0

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries: number
  ) {}

  async get(key: string, load: () => Promise<T>): Promise<T> {
    const now = Date.now()
    const existing = this.entries.get(key)
    if (existing && existing.expiresAt > now) return existing.value

    const generationAtStart = this.generation
    const value = load()
    const entry = { expiresAt: now + this.ttlMs, value }
    this.entries.set(key, entry)

    const discard = () => {
      if (this.entries.get(key) === entry) this.entries.delete(key)
    }
    value.then(() => {
      if (generationAtStart !== this.generation) discard()
    }, discard)

    for (const oldestKey of this.entries.keys()) {
      if (this.entries.size <= this.maxEntries) break
      this.entries.delete(oldestKey)
    }

    return value
  }

  invalidate() {
    this.generation += 1
    this.entries.clear()
  }
}
