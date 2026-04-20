const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);

// Socket.io for Real-time logs
const io = new Server(server, {
    cors: {
        origin: '*', // For development
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

// Pass io to routes via req.app.get('io') (if needed) but we can also manage it globally
app.set('io', io);

// io connection listener
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    socket.on('join_task', (taskId) => {
        socket.join(taskId);
        console.log(`Socket ${socket.id} joined task room ${taskId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

app.use('/api/auth', authRoutes);
app.use('/api', authenticateToken, apiRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recon_nandx';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => console.error('MongoDB connection error:', error));
