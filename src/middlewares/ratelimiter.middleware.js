import rateLimit from 'express-rate-limit';

// Limit: max 10 requests per minute per IP
export const generalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// You can create route-specific ones too
export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many login attempts, try again in a minute.',
});

export const geminiLimiter = rateLimit({
    windowMs: 3600 * 5 * 1000,
    max: 2,
    message: 'You have reached the limit for Gemini requests, please try again later.',
})