import express from 'express';
import { 
    getMatches, 
    expressInterest, 
    updateMatchStatus, 
    getOwnerRequests,
    getTenantMatches // Naya function import kiya
} from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/matches
 * @desc    Fetch available listings for Tenant Dashboard
 * @access  Private (Tenant)
 */
router.get('/', protect(['tenant']), getMatches);

/**
 * @route   GET /api/matches/my-matches
 * @desc    Fetch specific matches for the logged-in Tenant (Status check)
 * @access  Private (Tenant)
 */
router.get('/my-matches', protect(['tenant']), getTenantMatches);

/**
 * @route   POST /api/matches/interest
 * @desc    Tenant expresses interest, AI calculates compatibility
 * @access  Private (Tenant)
 */
router.post('/interest', protect(['tenant']), expressInterest);

/**
 * @route   PATCH /api/matches/:matchId/status
 * @desc    Owner accepts/declines interest
 * @access  Private (Owner)
 */
router.patch('/:matchId/status', protect(['owner']), updateMatchStatus);

/**
 * @route   GET /api/matches/owner-requests
 * @desc    Fetch all tenant requests for the owner's properties
 * @access  Private (Owner)
 */
router.get('/owner-requests', protect(['owner']), getOwnerRequests); 

export default router;