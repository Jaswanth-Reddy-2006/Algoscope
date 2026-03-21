const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
if (!process.env.DATABASE_URL) {
    console.error("CRITICAL ERROR: DATABASE_URL environment variable is missing!");
}

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const passport = require('passport');
require('./src/config/passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/db-check', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    const count = await prisma.problem.count();
    res.json({ status: 'connected', problemsCount: count });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message, stack: err.stack });
  }
});

// Routes
const authRoutes = require('./src/routes/auth');
const leetcodeRoutes = require('./src/routes/leetcode');
const analyticsRoutes = require('./src/routes/analytics');
const problemRoutes = require('./src/routes/problems');
const progressRoutes = require('./src/routes/progress');

app.use('/api/auth', authRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', progressRoutes);

app.use((err, req, res, next) => {
    console.error("UNDEFINED ERROR DETECTED:", err.stack);
    res.status(500).json({ 
        error: 'An unexpected internal error occurred.',
        message: err.message,
        path: req.path
    });
});

const gracefulShutdown = async () => {
    console.log("Shutting down Algoscope engine...");
    await prisma.$disconnect();
    process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

app.listen(PORT, () => {
    console.log(`🚀 Algoscope Backend Engine running on port ${PORT}`);
});
