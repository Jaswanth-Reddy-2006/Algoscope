const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// POST /api/progress/update
router.post('/update', async (req, res) => {
    const { userId, moduleId, scores, confidence, subPattern } = req.body;

    try {
        // Ensure user exists (especially for guest accounts)
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: { id: userId, email: userId.includes('@') ? userId : null }
        });

        // Find existing or use upsert
        const existingProgress = await prisma.userProgress.findUnique({
            where: {
                userId_moduleId: {
                    userId,
                    moduleId
                }
            }
        });

        let updateData = {
            confidence: confidence !== undefined ? confidence : undefined,
            lastPracticed: new Date(),
        };

        if (scores) {
            if (scores.drill !== undefined) updateData.drillScore = scores.drill;
            if (scores.visualizer !== undefined) updateData.visualizerScore = scores.visualizer;
            if (scores.template !== undefined) updateData.templateScore = scores.template;
            if (scores.recognition !== undefined) updateData.recognitionScore = scores.recognition;
            if (scores.edge !== undefined) updateData.edgeCaseScore = scores.edge;
        }

        if (subPattern && subPattern.id && subPattern.score !== undefined) {
            let currentSubPattern = {};
            if (existingProgress && existingProgress.subPatternConfidence) {
                try {
                    currentSubPattern = JSON.parse(existingProgress.subPatternConfidence);
                } catch (e) {
                    console.error("Failed to parse subPatternConfidence", e);
                }
            }
            currentSubPattern[subPattern.id] = subPattern.score;
            updateData.subPatternConfidence = JSON.stringify(currentSubPattern);
        }

        const progress = await prisma.userProgress.upsert({
            where: {
                userId_moduleId: {
                    userId,
                    moduleId
                }
            },
            update: updateData,
            create: {
                userId,
                moduleId,
                ...updateData,
                // Ensure defaults for create
                drillScore: updateData.drillScore || 0,
                visualizerScore: updateData.visualizerScore || 0,
                templateScore: updateData.templateScore || 0,
                recognitionScore: updateData.recognitionScore || 0,
                edgeCaseScore: updateData.edgeCaseScore || 0,
                confidence: updateData.confidence || 0,
                subPatternConfidence: updateData.subPatternConfidence || "{}"
            }
        });

        res.json(progress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/progress/:userId
router.get('/:userId', async (req, res) => {
    try {
        const progress = await prisma.userProgress.findMany({
            where: { userId: req.params.userId }
        });
        
        // Normalize for frontend (parse JSON string safely)
        const normalized = progress.map(p => {
            let subPattern = {};
            if (p.subPatternConfidence) {
                try {
                    subPattern = typeof p.subPatternConfidence === 'string' 
                        ? JSON.parse(p.subPatternConfidence) 
                        : p.subPatternConfidence;
                } catch (e) {
                    console.error(`Failed to parse subPatternConfidence for progress ${p.id}`, e);
                    subPattern = {};
                }
            }
            return {
                ...p,
                subPatternConfidence: subPattern
            };
        });
        
        res.json(normalized);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
