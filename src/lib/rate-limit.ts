/**
 * Simple in-memory sliding-window rate limiter.
 * Suitable for single-server deployments (e.g. Vercel serverless).
 *
 * Usage:
 *   const limiter = rateLimit({ maxRequests: 5, windowMs: 60_000 });
 *   await limiter.check(identifier); // throws if over limit
 */

const stores = new Map<string, Map<string, number[]>>();

interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

function getStore(name: string): Map<string, number[]> {
    if (!stores.has(name)) {
        stores.set(name, new Map());
    }
    return stores.get(name)!;
}

export function rateLimit(config: RateLimitConfig & { name: string }) {
    const store = getStore(config.name);

    return {
        check(identifier: string): void {
            const now = Date.now();
            const windowStart = now - config.windowMs;

            const timestamps = store.get(identifier) ?? [];
            const valid = timestamps.filter((t) => t > windowStart);

            if (valid.length >= config.maxRequests) {
                const retryAfter = Math.ceil(
                    (valid[0] + config.windowMs - now) / 1000
                );
                throw new Error(
                    `Too many requests. Please try again in ${retryAfter} seconds.`
                );
            }

            valid.push(now);
            store.set(identifier, valid);

            // Periodic cleanup: if store gets large, prune old entries
            if (store.size > 10_000) {
                const entries = Array.from(store.entries());
                for (const [key, ts] of entries) {
                    const fresh = ts.filter((t: number) => t > windowStart);
                    if (fresh.length === 0) {
                        store.delete(key);
                    } else {
                        store.set(key, fresh);
                    }
                }
            }
        },
    };
}

// Pre-configured limiters
export const authLimiter = rateLimit({
    name: 'auth',
    maxRequests: 5,
    windowMs: 60_000,
});

export const leadLimiter = rateLimit({
    name: 'lead',
    maxRequests: 3,
    windowMs: 60_000,
});

export const viewLimiter = rateLimit({
    name: 'view',
    maxRequests: 10,
    windowMs: 60_000,
});
