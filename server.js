require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const notesRouter = require('./routes/notes');
const askRouter = require('./routes/ask');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route (for health check/validation)
app.get('/', (req, res) => {
    res.send('AI Study Assistant Backend is running!');
});

// Routes
app.use('/api/notes', notesRouter);
app.use('/api/ask', askRouter);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-study-assistant';
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Start API Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
