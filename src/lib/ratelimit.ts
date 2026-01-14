import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";


export const registerLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "30 s"),
    analytics: true,
})

export const dashboardLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
})

export const teamCreationLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
});

export const teamEditLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
});
