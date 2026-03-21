const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const passport = require('passport');
require('./src/config/passport');

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});
