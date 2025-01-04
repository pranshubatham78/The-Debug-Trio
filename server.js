const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const appConfig = require("./backend/config/appConfig");
const connectDB = require("./backend/config/db");
const userRoutes = require("./backend/routes/userRoutes");
const progressRoutes = require('./backend/routes/progressRoutes');
const roadmapRoutes = require("./backend/routes/roadmapRoutes");

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: appConfig.server.baseUrl || 'http://localhost:8000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from 'frontend/public'
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// API Routes
app.use('/api/progress', progressRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use("/api/auth", userRoutes);

// Serve static HTML pages
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'login.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'progressTracker.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
    });
});

// Start the server
const PORT = appConfig.server.port || 5000;
app.listen(PORT, () => {
    console.log(`Server running on ${appConfig.server.baseUrl || 'http://localhost'}:${PORT}`);
});
