import mongoose from 'mongoose';

/**
 * Schema representing an interest match between a Tenant and a Listing.
 * Stores AI-computed compatibility score and status for persistence.
 */
const matchSchema = new mongoose.Schema({
    // The tenant who expressed interest
    tenant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The specific room listing the tenant is interested in
    listing: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Listing', 
        required: true 
    },
    // AI compatibility score (0-100) computed by Gemini or Fallback
    score: { 
        type: Number, 
        required: true,
        min: 0,
        max: 100 
    },
    // Qualitative explanation for the computed score
    explanation: { 
        type: String, 
        required: true,
        trim: true 
    },
    // Current interest status: 'viewed' (browsing), 'pending' (initial), 'accepted', or 'declined'
    status: { 
        type: String, 
        // 🔥 Yahan 'viewed' add kar diya hai taaki DB error na de 🔥
        enum: ['viewed', 'pending', 'accepted', 'declined'], 
        default: 'pending' 
    }
}, { 
    timestamps: true 
});

/**
 * Composite Index: Ensures a tenant cannot send multiple interest requests 
 * to the same listing, preventing duplicate match records in the DB.
 */
matchSchema.index({ tenant: 1, listing: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);