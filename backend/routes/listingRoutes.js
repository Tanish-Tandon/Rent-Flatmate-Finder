import express from 'express';
import { 
    createListing, 
    getMyListings, 
    getAllListings, 
    markListingAsFilled 
} from '../controllers/listingController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/listings
 * @desc    Fetch listings with optional location and budget filters
 * @access  Public
 */
router.get('/', getAllListings);

/**
 * @route   POST /api/listings/create
 * @desc    Create a new room listing (Owner only)
 * @access  Private
 */
router.post('/create', protect(['owner']), createListing);

/**
 * @route   GET /api/listings/my-listings
 * @desc    Fetch listings created by the logged-in owner
 * @access  Private
 */
router.get('/my-listings', protect(['owner']), getMyListings);

/**
 * @route   PATCH /api/listings/:id/fill
 * @desc    Mark a listing as filled to hide it from searches (Owner only)
 * @access  Private
 */
router.patch('/:id/fill', protect(['owner']), markListingAsFilled);
router.post(
  '/create',
  protect(['owner']),
  createListing
);

export default router;