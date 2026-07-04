import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // 

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (tenant or owner)
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Validation: Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered." });
        }

        // 2. Security: Hashing password with a proper salt factor
        const saltRounds = 12; // Increased to 12 for better security
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Persistence: Create new user document
        await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role 
        });

        res.status(201).json({ message: "Registration successful. You can now login." });
    } catch (error) {
        console.error("Signup Route Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validation: Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }

        // 2. Security: Compare the entered password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials. Please try again." });
        }

        // 3. Generate JWT Token (Contains User ID & Role for frontend logic)
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send successful response with token
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Route Error:", error.message);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});

export default router;