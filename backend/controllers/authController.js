import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Handles user registration.
 * Performs validation for duplicate emails, enforces role restrictions, and hashes passwords.
 */
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Security: Ensure all fields are provided before processing
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please provide all required fields." });
        }

        // Security: Prevent unauthorized 'admin' registration via API manipulation
        if (!['tenant', 'owner'].includes(role)) {
            return res.status(400).json({ message: "Invalid role selected." });
        }
        
        // Basic check to prevent duplicate accounts
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        // Hash password before saving to database (Security Best Practice)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword, 
            role 
        });

        // UX Improvement: Generate a token immediately to auto-login the user
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            message: "User registered successfully.",
            token,
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        res.status(500).json({ message: "Internal server error during registration." });
    }
};

/**
 * Handles user login.
 * Validates credentials and generates a JWT for session management.
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        const user = await User.findOne({ email });
        
        // Verify user existence and compare hashed password
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '24h' } 
            );
            
            // Return user details alongside the token for frontend state management
            res.status(200).json({ 
                message: "Login successful",
                token, 
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            });
        } else {
            // Generic error message for security to prevent enumeration attacks
            res.status(401).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Internal server error during login." });
    }
};