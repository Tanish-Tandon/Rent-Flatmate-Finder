import Match from '../models/Match.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';
import { getCompatibilityScore } from '../services/aiService.js';
import { sendNotification } from '../services/emailService.js';

// --- TENANT ACTIONS ---

/**
 * Fetch matches for the Tenant Dashboard
 * FIX: Calls AI Service, saves to DB so it doesn't recompute, and sorts by score!
 */
export const getMatches = async (req, res) => {
    try {
        const tenantId = req.user.id;
        const tenant = await User.findById(tenantId);
        
        // 🔥 FIX 1: Removed 'isActive: true' so it actually finds the rooms!
        const listings = await Listing.find({ isFilled: false }).populate('owner', 'name email');
        
        let dashboardData = [];

        for (let listing of listings) {
            let match = await Match.findOne({ tenant: tenantId, listing: listing._id });

            if (!match) {
                // LLM Fallback & Data Protection
                const tenantProfile = {
                    budgetRange: tenant?.budgetRange || 15000, 
                    preferredLocation: tenant?.preferredLocation || 'Any'
                };

                const aiResult = await getCompatibilityScore(tenantProfile, listing);

                match = await Match.create({
                    tenant: tenantId,
                    listing: listing._id,
                    score: aiResult?.score || 50,
                    explanation: aiResult?.explanation || "Compatible match based on system preferences.",
                    status: 'viewed' 
                });
            }

            dashboardData.push({
                _id: match._id, 
                listing,
                compatibilityScore: match.score,
                compatibilityExplanation: match.explanation
            });
        }

        dashboardData.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        res.status(200).json({ success: true, data: dashboardData });
    } catch (error) {
        console.error("Fetch Matches Error:", error);
        res.status(500).json({ success: false, message: "Error fetching matches." });
    }
};


export const getTenantMatches = async (req, res) => {
    try {
        const tenantId = req.user.id;
        // Only fetch actual interests sent (pending, accepted, declined), ignore 'viewed'
        const matches = await Match.find({ tenant: tenantId, status: { $ne: 'viewed' } })
            .populate('listing', 'location rent roomType')
            .populate('tenant', 'name'); 

        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        console.error("Error fetching tenant matches:", error.message);
        res.status(500).json({ success: false, message: "Error fetching matches." });
    }
};

export const expressInterest = async (req, res) => {
    try {
        const { listingId } = req.body; 
        const tenantId = req.user.id; 

        let match = await Match.findOne({ tenant: tenantId, listing: listingId });
        
        if (match && (match.status === 'pending' || match.status === 'accepted')) {
            return res.status(400).json({ success: false, message: "You have already sent an interest request for this property!" });
        }

        const listingDetails = await Listing.findById(listingId).populate('owner');

        if (!listingDetails) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }

        if (!match) {
            // Safety fallback if match wasn't created in getMatches
            match = await Match.create({
                tenant: tenantId,                                
                listing: listingId,                              
                score: 50,                    
                explanation: "System generated fallback match.", 
                status: 'pending'
            });
        } else {
            // Update status to trigger the request to owner
            match.status = 'pending';
            await match.save();
        }

        // REQUIREMENT: Email notification sent to owner when score >= 80
        if (match.score >= 80 && listingDetails.owner?.email) {
            try {
                await sendNotification(
                    listingDetails.owner.email, 
                    '🎉 Strong Match Found!', 
                    `A tenant has expressed interest in your listing with a highly compatible AI score of ${match.score}/100.\n\nReason: ${match.explanation}`
                );
            } catch (emailErr) {
                console.log("Email Notification failed:", emailErr.message);
            }
        }

        res.status(201).json({ success: true, message: "Interest sent successfully!", data: match });
    } catch (error) {
        console.error("Interest Request Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to process interest request." });
    }
};

// --- OWNER ACTIONS ---

export const updateMatchStatus = async (req, res) => {
    try {
        const matchId = req.params.matchId; 
        const { status } = req.body; 
        
        const match = await Match.findById(matchId).populate('tenant');

        if (!match) {
            return res.status(404).json({ success: false, message: "Match request not found." });
        }

        match.status = status;
        await match.save();

        if (match.tenant?.email) {
            try {
                await sendNotification(
                    match.tenant.email,
                    `Interest Status Update`,
                    `The owner has ${status} your interest request for the property.`
                );
            } catch (emailErr) {
                console.log("Email Notification failed:", emailErr.message);
            }
        }

        if (status === 'accepted') {
            const io = req.app.get("io");
            if (io) {
                io.to(match.tenant._id.toString()).emit('request_accepted', {
                    matchId: match._id,
                    message: "Owner has accepted your interest request!"
                });
            }
        }

        res.status(200).json({ success: true, message: `Interest ${status} successfully.`, data: match });
    } catch (error) {
        console.error("Match Status Update Error:", error.message);
        res.status(500).json({ success: false, message: "Unable to update status." });
    }
};

export const getOwnerRequests = async (req, res) => {
    try {
        const ownerId = req.user.id;
        const ownerListings = await Listing.find({ owner: ownerId }).select('_id');
        const listingIds = ownerListings.map(listing => listing._id);

        // Fetch requests that are actually sent (pending, accepted, declined)
        const requests = await Match.find({ listing: { $in: listingIds }, status: { $ne: 'viewed' } })
            .populate('tenant', 'name email budgetRange preferredLocation')
            .populate('listing', 'location rent roomType');

        // FIX: Transform data so frontend gets exactly 'compatibilityScore' and 'compatibilityExplanation'
        const formattedRequests = requests.map(req => {
            const reqObj = req.toObject();
            return {
                ...reqObj,
                compatibilityScore: reqObj.score,
                compatibilityExplanation: reqObj.explanation
            };
        });

        res.status(200).json({ success: true, data: formattedRequests });
    } catch (error) {
        console.error("Fetch Owner Requests Error:", error.message);
        res.status(500).json({ success: false, message: "Error fetching tenant requests." });
    }
};