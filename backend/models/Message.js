import mongoose from 'mongoose';

/**
 * Schema representing a chat message within a specific Match.
 * Stores message history to enable real-time chat persistence.
 */
const messageSchema = new mongoose.Schema({
    // Link to the specific Match instance
    matchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Match', 
        required: true,
        index: true // Indexed for fast retrieval of chat history by MatchID
    },
    // The user who sent this message
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // The message content
    text: { 
        type: String, 
        required: true,
        trim: true // Prevents storing blank/whitespace-only messages
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

export default mongoose.model('Message', messageSchema);