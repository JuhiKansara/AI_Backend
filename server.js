require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const notesRouter = require('./routes/notes');
const askRouter = require('./routes/ask');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root Route (for health check/validation)
let dbError = null;
mongoose.connection.on('error', (err) => {
    dbError = err.message;
    console.error('Mongoose connection error:', err);
});

app.get('/', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({
        status: 'AI Study Assistant Backend is running!',
        database: dbStatus,
        dbError: dbError,
        message: 'If you see this, the server is alive!'
    });
});

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/ask', askRouter);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/ai-study-assistant';

// Masked URI for logging
const maskedURI = MONGODB_URI.replace(/\/\/(.*):(.*)@/, '//****:****@');
console.log('Attempting to connect to:', maskedURI);

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Keep trying to connect for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        dbError = err.message;
    });

// Start API Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
