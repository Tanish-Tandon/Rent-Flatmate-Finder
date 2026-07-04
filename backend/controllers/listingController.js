import Listing from '../models/Listing.js';

/**
 * Create a new room listing.
 * This route is intended for owners to post their available properties.
 */
export const createListing = async (req, res) => {
    try {
        const { location, rent, availableFrom, roomType, furnishingStatus ,imageUrl} = req.body;
        
        // Security Check: Ensure the user provided all required data
        if (!location || !rent || !availableFrom || !roomType || !furnishingStatus) {
            return res.status(400).json({ success: false, message: "Please provide all required fields." });
        }

        // Create the listing in the database, attaching the logged-in user's ID as the owner
        const newListing = await Listing.create({
            owner: req.user.id,
            location,
            rent,
            availableFrom,
            roomType,
            furnishingStatus
        });

        return res.status(201).json({ success: true, message: "Room listed successfully!", data: newListing });
    } catch (error) {
        console.error("Create Listing Error:", error);

    return res.status(500).json({
        success: false,
        message: error.message,
    });
}
}
/**
 * Fetch listings specific to the logged-in owner.
 * Used for the owner's personal dashboard.
 */
export const getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user.id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: listings.length, data: listings });
    } catch (error) {
        console.error("Fetch My Listings Error:", error.message);
        return res.status(500).json({ success: false, message: "Error fetching your listings." });
    }
};

/**
 * Fetch all available listings with optional filtering for location and budget.
 * We only return listings that are not marked as filled.
 */
export const getAllListings = async (req, res) => {
    try {
        const { location, minBudget, maxBudget } = req.query;
        
        // Base filter: Only show listings that are actively looking for tenants
        let filter = { isFilled: false };
        
        // Dynamic filtering based on user input
        if (location) {
            filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
        }
        
        // Apply budget constraints if provided by the tenant
        if (minBudget || maxBudget) {
            filter.rent = { 
                $gte: Number(minBudget) || 0, 
                $lte: Number(maxBudget) || Infinity 
            };
        }
        
        const listings = await Listing.find(filter).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, count: listings.length, data: listings });
    } catch (error) {
        console.error("Listing Search Error:", error.message);
        return res.status(500).json({ success: false, message: "Error fetching listings." });
    }
};

/**
 * Mark a specific room listing as filled.
 * This ensures the room is hidden from public search results.
 */
/**
 * Mark a listing as filled to hide it from searches
 */
export const markListingAsFilled = async (req, res) => {
    try {
        const listingId = req.params.id;

        
        const listing = await Listing.findById(listingId);

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }

        // 2. Security Check: Ensure jo owner logged in hai, usi ki property hai yeh
        if (listing.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this listing." });
        }

        // 3. Status update karo aur save karo
        listing.isFilled = true;
        await listing.save();

        res.status(200).json({ success: true, message: "Property marked as filled and hidden from searches.", data: listing });
    } catch (error) {
        console.error("Mark As Filled Error:", error.message);
        res.status(500).json({ success: false, message: "Server crash while updating status." });
    }
};