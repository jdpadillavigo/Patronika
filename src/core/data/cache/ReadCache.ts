interface CacheStorage {
    multiGet(keys: string[]): Promise<readonly (readonly [string, string | null])[]>;
    multiSet(entries: [string, string][]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
}

interface Entry {
    value: unknown;
    fetchedAt: number;
    persist: boolean;
    collection?: boolean;
}

export interface ReadOptions {
    ttlMs: number;
    refresh?: boolean;
    persist?: boolean;
    collection?: boolean;
}

const MAX_ENTRIES = 128;
const MAX_STALE_MS = 7 * 24 * 60 * 60_000;
const RETRY_DELAY_MS = 30_000;
// Each storage row fits comfortably inside Android's per-entry limit.
const CHUNK_SIZE = 450_000;
const CHUNK_COUNT = 3;
const MAX_SNAPSHOT_SIZE = CHUNK_SIZE * CHUNK_COUNT - CHUNK_COUNT;

export default class ReadCache {
    private readonly entries = new Map<string, Entry>();
    private readonly pending = new Map<string, Promise<unknown>>();
    private readonly failures = new Map<string, { error: unknown; retryAt: number }>();
    private readonly keys = Array.from({ length: CHUNK_COUNT }, (_, index) => `@patronika_read_cache_v1_${index}`);
    private readonly ready: Promise<void>;
    private writes = Promise.resolve();
    private writeScheduled = false;
    private closed = false;

    constructor(
        private readonly storage: CacheStorage,
        private readonly scope: string,
        private readonly isTemporaryError: (error: unknown) => boolean,
    ) {
        this.ready = this.restore();
    }

    private async restore(): Promise<void> {
        try {
            const chunks = await this.storage.multiGet(this.keys);
            const json = chunks.map(([, value]) => value ?? '').join('');
            if (!json || this.closed) return;

            const snapshot = JSON.parse(json) as { scope: string; entries: [string, Entry][] };
            if (snapshot.scope !== this.scope || !Array.isArray(snapshot.entries)) return;
            for (const [key, entry] of snapshot.entries.slice(0, MAX_ENTRIES).reverse()) {
                if (typeof key === 'string' && entry?.persist && 'value' in entry
                    && Date.now() - entry.fetchedAt <= MAX_STALE_MS) {
                    this.entries.set(key, entry);
                }
            }
        } catch {
            // An unavailable or corrupt disk cache must not block remote reads.
        }
    }

    private scheduleWrite(): void {
        if (this.writeScheduled || this.closed) return;
        this.writeScheduled = true;
        this.writes = this.writes.then(async () => {
            this.writeScheduled = false;
            if (this.closed) return;

            const parts: string[] = [];
            const header = `{"scope":${JSON.stringify(this.scope)},"entries":[`;
            let length = header.length + 2;
            const newestFirst = [...this.entries].reverse();
            const ordered = [
                ...newestFirst.filter(([, entry]) => entry.collection),
                ...newestFirst.filter(([, entry]) => !entry.collection),
            ];
            for (const [key, entry] of ordered) {
                if (!entry.persist || Date.now() - entry.fetchedAt > MAX_STALE_MS) continue;
                const part = JSON.stringify([key, entry]);
                if (length + part.length + 1 > MAX_SNAPSHOT_SIZE) continue;
                parts.push(part);
                length += part.length + 1;
            }

            const snapshot = header + parts.join(',') + ']}';
            let offset = 0;
            const chunks = this.keys.map((key): [string, string] => {
                let end = offset + CHUNK_SIZE;
                const lastCodeUnit = snapshot.charCodeAt(end - 1);
                if (lastCodeUnit >= 0xd800 && lastCodeUnit <= 0xdbff) end -= 1;
                const chunk = snapshot.slice(offset, end);
                offset = end;
                return [key, chunk];
            });
            await this.storage.multiSet(chunks);
        }).catch(() => {});
    }

    private remember(key: string, entry: Entry): void {
        this.entries.delete(key);
        this.entries.set(key, entry);
        if (this.entries.size > MAX_ENTRIES) {
            const oldestDetail = [...this.entries].find(([, value]) => !value.collection);
            const oldest = oldestDetail?.[0] ?? this.entries.keys().next().value;
            if (oldest !== undefined) this.entries.delete(oldest);
        }
    }

    async read<T>(key: string, load: () => Promise<T>, options: ReadOptions): Promise<T> {
        await this.ready;
        if (this.closed) throw new Error('La sesión cambió');

        const cached = this.entries.get(key);
        const age = cached ? Date.now() - cached.fetchedAt : Infinity;
        if (cached && !options.refresh && age < options.ttlMs) {
            this.remember(key, cached);
            return cached.value as T;
        }

        const inFlight = this.pending.get(key);
        if (inFlight) return inFlight as Promise<T>;

        const failure = this.failures.get(key);
        if (!options.refresh && failure && Date.now() < failure.retryAt) {
            if (cached && age <= MAX_STALE_MS) return cached.value as T;
            throw failure.error;
        }

        const request: Promise<T> = Promise.resolve().then(load).then(
            value => {
                // A successful write may have replaced this read while it was in flight.
                if (this.pending.get(key) !== request) return this.read(key, load, { ...options, refresh: false });
                this.failures.delete(key);
                this.remember(key, {
                    value,
                    fetchedAt: Date.now(),
                    persist: options.persist ?? true,
                    collection: options.collection,
                });
                if (options.persist !== false) this.scheduleWrite();
                return value;
            },
            (error: unknown) => {
                if (this.closed) throw error;
                if (this.pending.get(key) !== request) return this.read(key, load, { ...options, refresh: false });
                if (!this.isTemporaryError(error)) {
                    if (this.entries.delete(key)) this.scheduleWrite();
                    throw error;
                }

                if (this.failures.size >= MAX_ENTRIES) {
                    const oldest = this.failures.keys().next().value;
                    if (oldest !== undefined) this.failures.delete(oldest);
                }
                this.failures.set(key, { error, retryAt: Date.now() + RETRY_DELAY_MS });
                if (cached && age <= MAX_STALE_MS) return cached.value as T;
                throw error;
            },
        ).finally(() => {
            if (this.pending.get(key) === request) this.pending.delete(key);
        });

        this.pending.set(key, request);
        return request;
    }

    async invalidate(...prefixes: string[]): Promise<void> {
        await this.ready;
        if (this.closed) return;
        const keys = new Set([...this.entries.keys(), ...this.pending.keys(), ...this.failures.keys()]);
        for (const key of keys) {
            if (!prefixes.some(prefix => key === prefix || key.startsWith(`${prefix}/`))) continue;
            this.entries.delete(key);
            this.pending.delete(key);
            this.failures.delete(key);
        }
        this.scheduleWrite();
        await this.writes;
    }

    async update<T>(key: string, change: (value: T) => T): Promise<void> {
        await this.ready;
        if (this.closed) return;
        this.pending.delete(key);
        this.failures.delete(key);
        const entry = this.entries.get(key);
        // A mutation response cannot reconstruct a list that has never been fetched.
        if (!entry) return;
        this.remember(key, { ...entry, value: change(entry.value as T) });
        if (entry.persist) this.scheduleWrite();
        await this.writes;
    }

    async clear(): Promise<void> {
        this.closed = true;
        this.entries.clear();
        this.failures.clear();
        this.pending.clear();
        await this.writes;
        await this.storage.multiRemove(this.keys).catch(() => {});
    }
}
