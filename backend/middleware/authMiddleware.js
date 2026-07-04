import jwt from 'jsonwebtoken';

/**
 * Middleware for Protected Routes.
 * Verifies JWT tokens and enforces Role-Based Access Control (RBAC).
 * @param {Array} roles - Array of allowed roles (e.g., ['admin', 'owner'])
 */
export const protect = (roles = []) => (req, res, next) => {
    // Extracting Bearer token from authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith("Bearer ") 
                  ? authHeader.split(" ")[1] 
                  : null;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token against the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // RBAC Check: Ensure the user's role is permitted for this route
        if (roles.length > 0 && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access forbidden: insufficient permissions." });
        }

        // Attach user data to the request object for downstream controllers
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

/**
 * Middleware for Admin-only access.
 * Must be used after 'protect' middleware.
 */
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
};