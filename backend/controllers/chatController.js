import Message from '../models/Message.js';
import Match from '../models/Match.js';

/**
 * Fetch all previous messages for a specific match/conversation
 */
export const getChatHistory = async (req, res) => {
    try {
        const { matchId } = req.params;

        // Security check: Ensure the match exists
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ success: false, message: "Chat room not found." });
        }

        // Verify that the logged-in user is either the tenant or the owner of this match
        if (match.tenantId.toString() !== req.user.id && match.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to view this chat." });
        }

        // Fetch messages and sort them by oldest to newest (1)
        const messages = await Message.find({ matchId })
            .sort({ createdAt: 1 })
            .lean(); // .lean() makes query faster

        res.status(200).json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        console.error("Fetch Chat Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to load chat history." });
    }
};