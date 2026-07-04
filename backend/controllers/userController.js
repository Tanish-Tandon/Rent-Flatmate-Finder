import User from '../models/User.js';

/**
 * @route   PUT /api/users/profile
 * @desc    Updates the tenant's profile (Budget, Location, Move-in Date)
 * @access  Private (Tenant only)
 */
export const updateProfile = async (req, res) => {
    try {
        const { preferredLocation, budget, moveInDate } = req.body;
        
        // Ensure the user exists using the ID from the JWT token
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Update the fields dynamically
        user.preferredLocation = preferredLocation || user.preferredLocation;
        user.budget = budget || user.budget;
        user.moveInDate = moveInDate || user.moveInDate;

        // Save the updated document back to MongoDB
        await user.save();

        res.status(200).json({ 
            message: "Profile updated successfully.", 
            data: user 
        });
    } catch (error) {
        console.error("Profile Update Error:", error.message);
        res.status(500).json({ message: "Server error while updating profile." });
    }
};