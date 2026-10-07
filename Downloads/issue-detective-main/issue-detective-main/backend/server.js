import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:3000']
  : true; // allow all in dev

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Security headers (lightweight without helmet) ─────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'CivicConnect Backend API',
    phase: 'Phase 9 - Production Deployment',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 CivicConnect Express Backend — ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`📍 Health: http://localhost:${PORT}/api/health`);
    if (!isProduction) {
      console.log(`🔗 Frontend: http://localhost:5173`);
    }
    console.log(`==================================================\n`);
  });
};

startServer();
