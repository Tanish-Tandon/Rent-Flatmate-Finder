import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import our isolated Socket.io module
import { initializeSocket } from './socket.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Create the HTTP server instance required for WebSockets
const server = http.createServer(app);

// Initialize WebSockets using the isolated module
initializeSocket(server);

// --- 🛠️ UPDATED MIDDLEWARE SETTINGS ---

// app.use(cors({
//     origin: '*', 
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
// }));
app.use(cors({
    origin: true, 
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;
console.log("Testing API Key:", process.env.GEMINI_API_KEY ? "Key Found!" : "Key Missing!");

// Start the server using 'server.listen' (Not app.listen) to bind both HTTP and WebSockets
server.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});