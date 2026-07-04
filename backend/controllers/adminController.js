import User from '../models/User.js';
import Listing from '../models/Listing.js';

/**
 * Controller to fetch all platform metrics for the admin dashboard.
 */
export const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalListings, activeListings] = await Promise.all([
            User.countDocuments(),
            Listing.countDocuments(),
            Listing.countDocuments({ isFilled: false })
        ]);

        res.status(200).json({ 
            success: true, 
            data: { totalUsers, totalListings, activeListings } 
        });
    } catch (error) {
        console.error("Stats Error:", error.message);
        res.status(500).json({ success: false, message: "Could not fetch platform statistics." });
    }
};

/**
 * Fetch all users for Admin User Table.
 */
export const getAllUsers = async (req, res) => {
    try {
        // Exclude password for security
        const users = await User.find().select("-password");
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Fetch Users Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch users." });
    }
};

/**
 * Fetch all listings for Admin Listing Table.
 */
export const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find().populate("owner", "name email");
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        console.error("Fetch Listings Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch listings." });
    }
};

/**
 * Controller to remove a user or listing from the database.
 */
export const deleteResource = async (req, res) => {
    try {
        const { type, id } = req.params;

        if (type === 'user' || type === 'users') {
            await User.findByIdAndDelete(id);
        } else if (type === 'listing' || type === 'listings') {
            await Listing.findByIdAndDelete(id);
        } else {
            return res.status(400).json({ success: false, message: "Invalid resource type." });
        }
        
        res.status(200).json({ success: true, message: `${type} deleted successfully.` });
    } catch (error) {
        console.error("Delete Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to delete resource." });
    }
};