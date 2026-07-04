import mongoose from 'mongoose';

/**
 * Schema representing an application user.
 * Supports three roles: 'tenant', 'owner', 'admin'.
 * Includes nested profile object for tenant preferences.
 */
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true, // Standardizing email format
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/] 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['tenant', 'owner', 'admin'], 
        required: true 
    },
    // User profile: primarily used for tenants
    profile: {
        preferredLocation: { 
            type: String,
            trim: true 
        },
       budgetRange: {
            type: Number,
            min: 0
        },
        moveInDate: { type: Date }
    }
}, { 
    timestamps: true 
});

export default mongoose.model('User', userSchema);