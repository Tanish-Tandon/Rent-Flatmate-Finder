import express from 'express';
import { 
    getAdminStats, 
    deleteResource, 
    getAllUsers, 
    getAllListings 
} from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Dashboard Stats (GET /api/admin/stats)
router.get('/stats', protect(['admin']), isAdmin, getAdminStats);

// 2. Fetch all users for Admin Table (GET /api/admin/users)
router.get('/users', protect(['admin']), isAdmin, getAllUsers);

// 3. Fetch all listings for Admin Table (GET /api/admin/listings)
router.get('/listings', protect(['admin']), isAdmin, getAllListings);

// 4. Delete Resource (DELETE /api/admin/:type/:id)
// Example: DELETE /api/admin/users/123 or DELETE /api/admin/listings/456
router.delete('/:type/:id', protect(['admin']), isAdmin, deleteResource);

export default router;