import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// In-memory fallback for development
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

const FREE_TIER_LIMIT = 3; // 3 checks per day

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    reset: Date;
}

/**
 * Check rate limit for a user
 * Uses Upstash Redis if RATE_LIMIT_REDIS_URL is configured, otherwise in-memory
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
    const redisUrl = process.env.RATE_LIMIT_REDIS_URL;

    if (redisUrl) {
        return checkRedisRateLimit(identifier, redisUrl);
    }

    return checkInMemoryRateLimit(identifier);
}

async function checkRedisRateLimit(identifier: string, redisUrl: string): Promise<RateLimitResult> {
    const redis = new Redis({
        url: redisUrl,
        token: process.env.RATE_LIMIT_REDIS_TOKEN || '',
    });

    const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(FREE_TIER_LIMIT, '1 d'),
        analytics: true,
        prefix: 'before-send',
    });

    const result = await ratelimit.limit(identifier);

    return {
        allowed: result.success,
        remaining: result.remaining,
        reset: new Date(result.reset),
    };
}

function checkInMemoryRateLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const existing = inMemoryStore.get(identifier);

    // Reset if expired
    if (!existing || existing.resetAt < now) {
        inMemoryStore.set(identifier, {
            count: 1,
            resetAt: now + dayMs,
        });

        return {
            allowed: true,
            remaining: FREE_TIER_LIMIT - 1,
            reset: new Date(now + dayMs),
        };
    }

    // Check if limit exceeded
    if (existing.count >= FREE_TIER_LIMIT) {
        return {
            allowed: false,
            remaining: 0,
            reset: new Date(existing.resetAt),
        };
    }

    // Increment count
    existing.count += 1;
    inMemoryStore.set(identifier, existing);

    return {
        allowed: true,
        remaining: FREE_TIER_LIMIT - existing.count,
        reset: new Date(existing.resetAt),
    };
}

/**
 * Get identifier for rate limiting
 * Uses user ID if authenticated, otherwise IP address
 */
export function getRateLimitIdentifier(userId?: string, ip?: string): string {
    if (userId) {
        return `user:${userId}`;
    }

    return `ip:${ip || 'unknown'}`;
}
