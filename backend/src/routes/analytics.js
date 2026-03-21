const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/summary', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Count solved problems by difficulty
        const solvedStats = await prisma.solvedProblem.findMany({
            where: { userId },
            select: { problemSlug: true }
        });

        const slugs = solvedStats.map(s => s.problemSlug);
        
        const difficultyCounts = await prisma.problem.groupBy({
            by: ['difficulty'],
            where: {
                slug: { in: slugs }
            },
            _count: {
                id: true
            }
        });

        const stats = {
            Easy: 0,
            Medium: 0,
            Hard: 0,
            Total: slugs.length
        };

        difficultyCounts.forEach(c => {
            stats[c.difficulty] = c._count.id;
        });

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

router.get('/proficiency', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Get all solved problems with metadata
        const solved = await prisma.solvedProblem.findMany({
            where: { userId },
            select: { problemSlug: true }
        });

        const slugs = solved.map(s => s.problemSlug);
        const problems = await prisma.problem.findMany({
            where: { slug: { in: slugs } }
        });

        // 2. Global Score & Level
        let score = 0;
        const patternStats = {};

        problems.forEach(p => {
            const points = p.difficulty === 'Hard' ? 100 : p.difficulty === 'Medium' ? 30 : 10;
            score += points;

            if (p.algorithmType) {
                const key = `pattern_${p.algorithmType}`;
                if (!patternStats[key]) {
                    patternStats[key] = { points: 0, count: 0 };
                }
                patternStats[key].points += points;
                patternStats[key].count += 1;
            }
        });

        // 3. Calculate Confidence per Pattern
        // Max points target for 100% confidence per pattern is set to 300 points (approx 10 Mediums or 3 Hards)
        const TARGET_POINTS = 300;
        const confidencePatterns = {};
        
        Object.keys(patternStats).forEach(key => {
            confidencePatterns[key] = {
                confidence: Math.min(100, Math.round((patternStats[key].points / TARGET_POINTS) * 100)),
                count: patternStats[key].count
            };
        });

        const level = Math.floor(score / 500) + 1;
        const nextLevelProgress = (score % 500) / 5; // percentage

        res.json({
            score,
            level,
            progress: nextLevelProgress,
            title: level >= 10 ? 'Elite Architect' : level >= 5 ? 'Senior Practitioner' : 'Initial Explorer',
            patterns: confidencePatterns
        });
    } catch (err) {
        console.error("Proficiency calc error:", err);
        res.status(500).json({ error: 'Failed to calculate proficiency' });
    }
});

router.get('/heatmap', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const solved = await prisma.solvedProblem.findMany({
            where: { 
                userId,
                solvedAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30))
                }
            },
            select: { solvedAt: true }
        });

        // Group by day
        const heatmap = {};
        solved.forEach(s => {
            const date = s.solvedAt.toISOString().split('T')[0];
            heatmap[date] = (heatmap[date] || 0) + 1;
        });

        res.json(heatmap);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch heatmap' });
    }
});

module.exports = router;
