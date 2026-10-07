const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const https = require('https');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to Database
connectDB(); // database connection

// Register Models
require('./models/User');
require('./models/Admin');
require('./models/Job');
require('./models/Application');
require('./models/Company');
require('./models/Skill');

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
// Allow all centennialinfotech.com subdomains plus known deployment origins
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://centennial-infotech-hiring-new.netlify.app',
    'https://centennial-infotech-staff-hiring.vercel.app',
    'https://centennial-infotech-hiring.vercel.app',
    'https://career.centennialinfotech.com',
    'https://staffing.centennialinfotech.com',
    'https://centennialinfotech.com',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin === 'https://centennialinfotech.com' ||
            origin.endsWith('.centennialinfotech.com')
        ) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// ── Explicitly handle ALL OPTIONS pre-flight requests before any other middleware
// This ensures CORS headers are sent even if a route doesn't exist yet
app.options(/.*/, cors(corsOptions));

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// ─── Health Check ──────────────────────────────────────────────────────────────
// Used by Render's health check and by our own keep-alive ping below
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Basic Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Job Portal API' });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

// ─── Port ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

    // ── Keep-Alive Self-Ping ────────────────────────────────────────────────
    // Render free tier spins down after 15 min of inactivity.
    // This pings our own /health endpoint every 14 minutes to stay warm.
    // Only runs in production to avoid unnecessary pings in dev.
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
        const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
        const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

        setInterval(() => {
            const url = `${SELF_URL}/health`;
            const lib = url.startsWith('https') ? https : http;

            lib.get(url, (res) => {
                console.log(`[Keep-Alive] Self-ping → ${url} — Status: ${res.statusCode}`);
            }).on('error', (err) => {
                console.warn(`[Keep-Alive] Self-ping failed: ${err.message}`);
            });
        }, PING_INTERVAL_MS);

        console.log(`[Keep-Alive] Self-ping active — pinging ${SELF_URL}/health every 14 min`);
    }
});

