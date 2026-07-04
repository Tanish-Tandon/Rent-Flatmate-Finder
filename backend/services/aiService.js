import Groq from "groq-sdk";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Groq SDK with the API key from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- PRO FEATURE 1: ADVANCED RULE-BASED FALLBACK ENGINE ---
// This function acts as a safety net if the AI service fails.
const getRuleBasedScore = (tenantBudget, listingRent, tenantLoc, listingLoc) => {
    let score = 0;
    let reasons = [];

    // 1. Location Logic (50 points)
    const tLoc = tenantLoc?.toLowerCase() || "";
    const lLoc = listingLoc?.toLowerCase() || "";
    
    if (tLoc && lLoc && (tLoc.includes(lLoc) || lLoc.includes(tLoc))) {
        score += 50;
        reasons.push("Perfect location match");
    } else {
        score += 10;
        reasons.push("Different locations");
    }

    // 2. Budget Logic (50 points)
    const budgetDiff = (tenantBudget || 0) - (listingRent || 0);
    if (budgetDiff >= 0) {
        score += 50;
        reasons.push("Well within budget");
    } else if (budgetDiff >= -3000) { // Tolerable difference
        score += 30;
        reasons.push("Slightly above budget");
    } else {
        score += 10;
        reasons.push("Over budget");
    }

    return {
        score,
        explanation: `[System Fallback Active] ${reasons.join(' & ')}.`
    };
};

/**
 * Computes compatibility score between a tenant and a listing using Groq Llama 3.
 * Includes a fallback mechanism if the AI service fails.
 */
export const getCompatibilityScore = async (profile, listing) => {
    try {
        // Structured prompt for Groq Llama 3
        const prompt = `
            Analyze the compatibility between this room listing and tenant profile.
            Listing: ${JSON.stringify(listing)}
            Tenant: ${JSON.stringify(profile)}
            
            Return ONLY a valid JSON object with:
            - "score": number (0-100)
            - "explanation": a short string (under 50 words) explaining why.
            Do not include markdown or extra text.
        `;
        
        // Call Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", // Groq's super-fast model
            temperature: 0.2,
        });

        // Parse and return the response
        const responseText = chatCompletion.choices[0].message.content;
        const cleanJson = responseText.replace(/```json|```/g, '').trim();
        
        return JSON.parse(cleanJson);

    } catch (error) {
        // Log the actual error for backend monitoring
        console.error("⚠️ AI Service Error - Initiating Smart Fallback Engine:", error.message);
        
        // PRO FEATURE TRIGGER: Extracting budget securely
        const tenantMaxBudget = profile.budgetRange?.max || profile.budget || 0; 
        
        return getRuleBasedScore(
            tenantMaxBudget, 
            listing.rent, 
            profile.preferredLocation, 
            listing.location
        );
    }
};