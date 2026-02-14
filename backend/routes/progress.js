const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');

// POST /api/progress/update
router.post('/update', async (req, res) => {
    const { userId, moduleId, scores, confidence, subPattern } = req.body;

    try {
        // Find existing or create new
        let progress = await UserProgress.findOne({ userId, moduleId });

        if (!progress) {
            progress = new UserProgress({ userId, moduleId });
        }

        // Update scores if provided
        if (scores) {
            if (scores.drill !== undefined) progress.drillScore = scores.drill;
            if (scores.visualizer !== undefined) progress.visualizerScore = scores.visualizer;
            if (scores.template !== undefined) progress.templateScore = scores.template;
            if (scores.recognition !== undefined) progress.recognitionScore = scores.recognition;
            if (scores.edge !== undefined) progress.edgeCaseScore = scores.edge;
        }

        // Update aggregate confidence logic
        if (confidence !== undefined) {
            progress.confidence = confidence;
        }

        // Update sub-pattern specific confidence map
        if (subPattern && subPattern.id && subPattern.score !== undefined) {
            progress.subPatternConfidence.set(subPattern.id, subPattern.score);
        }

        progress.lastPracticed = Date.now();

        await progress.save();
        res.json(progress);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// GET /api/progress/:userId
router.get('/:userId', async (req, res) => {
    try {
        const progress = await UserProgress.find({ userId: req.params.userId });
        res.json(progress);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
