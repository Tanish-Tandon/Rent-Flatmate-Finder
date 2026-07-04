import { z } from 'zod';


export const registerSchema = z.object({
    name: z.string().min(2, "Name should be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(['tenant', 'owner'])
});

export const validateRequest = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: err.errors[0].message });
    }
};

// USE: router.post('/register', validateRequest(registerSchema), registerController);