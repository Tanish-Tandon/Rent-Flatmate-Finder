import express from 'express';
import { updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to update profile. Protected by JWT and restricted to 'tenant' role.
router.put('/profile', protect(['tenant']), updateProfile);

export default router;