import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from './models/Message.js';

/**
 * Initializes Socket.io with the HTTP server and sets up secure connections.
 */
export const initializeSocket = (server) => {
    // CORS setup to allow frontend connections.
    const io = new Server(server, { 
        cors: { 
            origin: process.env.CLIENT_URL || '*',
            methods: ["GET", "POST"]
        } 
    });

    // --- SECURITY MIDDLEWARE ---
    // Verifies JWT token for every socket connection to ensure only authorized users access chat.
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error('Authentication Error: Token missing'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; 
            next(); 
        } catch (error) {
            console.error('Socket Connection Blocked: Invalid or Expired Token');
            return next(new Error('Authentication Error: Invalid Token'));
        }
    });

    // --- REAL-TIME COMMUNICATION ---
    io.on('connection', (socket) => {
        console.log(`User Connected Securely: ${socket.id} (User ID: ${socket.user.id})`);

        // Join specific room based on Match ID
        socket.on('join_room', (matchId) => {
            socket.join(matchId);
            console.log(`User ${socket.user.id} joined room: ${matchId}`);
        });

        // Handle incoming messages and save to MongoDB
        socket.on('send_message', async (data) => {
            try {
                // Ensure payload matches the 'Message' schema (using 'sender' instead of 'senderId')
                const messagePayload = {
                    matchId: data.matchId,
                    sender: socket.user.id, // Matches 'sender' field in Message.js
                    text: data.text
                };

                // Data persistence to MongoDB
               // Data persistence to MongoDB
                const msg = await Message.create(messagePayload); 
                
                // 🔥 FIX: Convert to object and add 'senderId' for the frontend
                const emitData = msg.toObject();
                emitData.senderId = emitData.sender; 
                
                // Broadcast the message only to users in that specific match room
                io.to(data.matchId).emit('receive_message', emitData);
                
            } catch (error) {
                console.error("Chat Persistence Error:", error.message);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User Disconnected: ${socket.user.id}`);
        });
    });
};