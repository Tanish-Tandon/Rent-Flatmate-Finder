import rateLimit from 'express-rate-limit';

// SECURITY LAYER: 
// Prevent malicious users from spamming the LLM API and burning our API credits.
// Restricts a single IP address to a maximum of 10 AI match requests every 15 minutes.
export const aiMatchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 10, // Max 10 requests allowed per window
    message: {
        success: false,
        message: "Hold on! You've requested too many AI matches recently. Let's take a 15-minute break to avoid overloading our engine."
    },
    // Standardizing headers as per modern API practices
    standardHeaders: true, 
    legacyHeaders: false, 
});

/* 
  HOW TO USE IN ROUTES:
  import { aiMatchLimiter } from '../middlewares/rateLimiter.js';
  router.post('/score', aiMatchLimiter, getCompatibilityScore);
*/