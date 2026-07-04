import multer from 'multer';
import sharp from 'sharp';

// Keep the incoming file in RAM temporarily. 
// We do this so we can process it with Sharp before tossing it to Cloudinary.
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Hard cap at 5MB to prevent server memory bloat
    fileFilter: (req, file, cb) => {
        // Basic validation: Only allow actual image files through the gate
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed!'), false);
        }
    }
});

// MIDDLEWARE: Optimize images on the fly.
// Saves massive amounts of Cloudinary storage space and significantly boosts frontend load times.
export const optimizeImage = async (req, res, next) => {
    // If the owner didn't upload a photo, just move on to the next controller
    if (!req.file) return next(); 

    try {
        // Resize to a reasonable max dimension (800x800) and convert to WebP format.
        // WebP provides insane compression without noticeable quality loss.
        const optimizedBuffer = await sharp(req.file.buffer)
            .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        // Swap out the original heavy buffer with our new lightweight version
        req.file.buffer = optimizedBuffer;
        req.file.mimetype = 'image/webp';
        
        next();
    } catch (error) {
        console.error("[Performance Middleware] Image optimization crashed:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to process the uploaded image. Please try a different photo." 
        });
    }
};

/* 
  HOW TO USE IN ROUTES:
  import { upload, optimizeImage } from '../middlewares/upload.js';
  router.post('/create-listing', upload.single('photo'), optimizeImage, createListing);
*/