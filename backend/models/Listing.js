import mongoose from 'mongoose';

/**
 * Listing Schema for Room Listings.
 * Includes data integrity constraints and a soft-delete toggle.
 */
const listingSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    location: { 
        type: String, 
        required: true,
        trim: true,
        index: true
    },
    rent: { 
        type: Number, 
        required: true,
        min: [0, 'Rent must be a positive number']
    },
    availableFrom: { 
        type: Date, 
        required: true 
    },
    roomType: { 
        type: String, 
        required: true,
        enum: {
            values: ['shared', 'private', 'entire-flat'],
            message: '{VALUE} is not a valid room type'
        }
    }, 
    furnishingStatus: { 
        type: String, 
        required: true,
        enum: ['furnished', 'semi-furnished', 'unfurnished'] 
    }, 
    photos: [{ 
        type: String
    }], 
    
    // Soft-delete toggle: When true, the room is off the market
    isFilled: { 
        type: Boolean, 
        default: false 
    },
    
    // Global active flag for admin control
    isActive: { 
        type: Boolean, 
        default: true 
    },
    imageUrl: { type: String, default: '' } 
}, { 
    timestamps: true 
});

// Middleware: Auto-exclude filled or inactive listings (Without 'next' to prevent Kareem crash)
// listingSchema.pre('find', function() {
//     this.where({ isFilled: false, isActive: true });
// });

// listingSchema.pre('findOne', function() {
//     this.where({ isFilled: false, isActive: true });
// });

export default mongoose.model('Listing', listingSchema);