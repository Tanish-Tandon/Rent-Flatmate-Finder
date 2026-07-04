import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/chat/:matchId
 * @desc    Fetch chat history for a specific match
 * @access  Private (Only participants of the match)
 */

router.get('/:matchId', protect(['tenant', 'owner']), getChatHistory);

export default router;