const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/solved', authMiddleware, async (req, res) => {
    try {
        const solved = await prisma.solvedProblem.findMany({
            where: { userId: req.user.id },
            include: { user: false } // We just want the slugs
        });
        res.json(solved);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch solved problems' });
    }
});

router.get('/', async (req, res) => {
    try {
        const problems = await prisma.problem.findMany();
        
        // Parse JSON strings back to objects for frontend compatibility
        const parsed = problems.map(p => ({
            ...p,
            tags: p.tags ? JSON.parse(p.tags) : [],
            constraints: p.constraints ? JSON.parse(p.constraints) : [],
            examples: p.examples ? JSON.parse(p.examples) : [],
            brute_force_steps: p.brute_force_steps ? JSON.parse(p.brute_force_steps) : [],
            optimal_steps: p.optimal_steps ? JSON.parse(p.optimal_steps) : [],
            complexity: p.complexity ? JSON.parse(p.complexity) : {},
            patternSignals: p.patternSignals ? JSON.parse(p.patternSignals) : [],
            edgeCases: p.edgeCases ? JSON.parse(p.edgeCases) : [],
            thinking_guide: p.thinking_guide ? JSON.parse(p.thinking_guide) : {},
            secondaryPatterns: p.secondaryPatterns ? JSON.parse(p.secondaryPatterns) : [],
            labConfig: p.labConfig ? JSON.parse(p.labConfig) : null
        }));
        
        res.json(parsed);
    } catch (err) {
        console.error("Fetch problems error:", err);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const p = await prisma.problem.findUnique({
            where: { slug: req.params.slug }
        });
        
        if (!p) return res.status(404).json({ error: 'Problem not found' });
        
        const parsed = {
            ...p,
            tags: p.tags ? JSON.parse(p.tags) : [],
            constraints: p.constraints ? JSON.parse(p.constraints) : [],
            examples: p.examples ? JSON.parse(p.examples) : [],
            brute_force_steps: p.brute_force_steps ? JSON.parse(p.brute_force_steps) : [],
            optimal_steps: p.optimal_steps ? JSON.parse(p.optimal_steps) : [],
            complexity: p.complexity ? JSON.parse(p.complexity) : {},
            patternSignals: p.patternSignals ? JSON.parse(p.patternSignals) : [],
            edgeCases: p.edgeCases ? JSON.parse(p.edgeCases) : [],
            thinking_guide: p.thinking_guide ? JSON.parse(p.thinking_guide) : {},
            secondaryPatterns: p.secondaryPatterns ? JSON.parse(p.secondaryPatterns) : [],
            labConfig: p.labConfig ? JSON.parse(p.labConfig) : null
        };
        
        res.json(parsed);
    } catch (err) {
        console.error("Fetch single problem error:", err);
        res.status(500).json({ error: 'Failed to fetch problem' });
    }
});

module.exports = router;
