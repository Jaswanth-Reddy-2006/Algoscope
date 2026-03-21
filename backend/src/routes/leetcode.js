const express = require('express');
const router = express.Router();
const axios = require('axios');
const { fetchUserProfile, fetchSolvedProblems, fetchRecentSubmissions, fetchProblemDetail } = require('../services/leetcodeService');
const authMiddleware = require('../middleware/authMiddleware');
const { getPatternForSlug } = require('../utils/patternMapper');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/status', authMiddleware, async (req, res) => {
    console.log(`[LeetCode] GET /status - User: ${req.user.id}`);
    try {
        const account = await prisma.leetcodeAccount.findUnique({
            where: { userId: req.user.id }
        });
        res.json(account);
    } catch (err) {
        console.error("[LeetCode] Status error:", err);
        res.status(500).json({ error: 'Failed to fetch connection status' });
    }
});

router.delete('/disconnect', authMiddleware, async (req, res) => {
    console.log(`[LeetCode] DELETE /disconnect - User: ${req.user.id}`);
    try {
        await prisma.leetcodeAccount.delete({
            where: { userId: req.user.id }
        });
        res.json({ message: 'LeetCode account disconnected' });
    } catch (err) {
        console.error("[LeetCode] Disconnect error:", err);
        res.status(500).json({ error: 'Failed to disconnect account' });
    }
});

router.post('/connect', authMiddleware, async (req, res) => {
    const { username: providedUsername, sessionToken } = req.body;
    const userId = req.user.id;
    let username = providedUsername;
    let limit = 20;

    console.log(`[LeetCode] POST /connect - User: ${userId}, Type: ${sessionToken ? 'Omega' : 'Public'}`);

    try {
        if (sessionToken) {
            const userProfile = await fetchUserProfile(sessionToken);
            if (!userProfile) {
                return res.status(401).json({ error: 'Invalid or expired session token. Protocol failed.' });
            }
            username = userProfile.username;
            limit = 100; // Deep Sync for Omega Protocol
            console.log(`[LeetCode] Omega Link established for: ${username}`);
        }

        if (!username) {
            return res.status(400).json({ error: 'Username or session token required' });
        }

        const stats = await fetchSolvedProblems(username, sessionToken);
        
        if (!stats) {
            return res.status(404).json({ error: 'LeetCode user not found. Please check your credentials.' });
        }

        // Upsert LeetcodeAccount
        await prisma.leetcodeAccount.upsert({
            where: { userId },
            update: { username, lastSynced: new Date() },
            create: { userId, username, lastSynced: new Date() }
        });

        // 2. Fetch and sync recent submissions
        const recentSubmissions = await fetchRecentSubmissions(username, sessionToken, limit);
        
        if (recentSubmissions && recentSubmissions.length > 0) {
            console.log(`[LeetCode] Parallel Syncing ${recentSubmissions.length} recent problems for ${username} [OPTIMIZED]`);
            
            // Collect unique slugs
            const uniqueSlugs = [...new Set(recentSubmissions.map(s => s.titleSlug))];
            
            // Check which problems are missing metadata
            const existingProblems = await prisma.problem.findMany({
                where: { slug: { in: uniqueSlugs } }
            });
            const existingSlugs = new Set(existingProblems.map(p => p.slug));
            const missingSlugs = uniqueSlugs.filter(slug => !existingSlugs.has(slug));

            if (missingSlugs.length > 0) {
                console.log(`[LeetCode] Fetching metadata for ${missingSlugs.length} new problems...`);
                await Promise.all(missingSlugs.map(async (slug) => {
                    try {
                        const detail = await fetchProblemDetail(slug);
                        if (detail) {
                            await prisma.problem.create({
                                data: {
                                    slug,
                                    title: detail.title,
                                    difficulty: detail.difficulty,
                                    algorithmType: getPatternForSlug(slug)
                                }
                            });
                        }
                    } catch (err) {
                        console.warn(`[LeetCode] Metadata fetch failed for ${slug}:`, err.message);
                    }
                }));
            }

            // Sync solved status
            await Promise.all(recentSubmissions.map(async (sub) => {
                try {
                    const existing = await prisma.solvedProblem.findFirst({
                        where: {
                            userId: userId,
                            problemSlug: sub.titleSlug
                        }
                    });

                    if (!existing) {
                        await prisma.solvedProblem.create({
                            data: {
                                userId: userId,
                                problemSlug: sub.titleSlug,
                                solvedAt: new Date(parseInt(sub.timestamp) * 1000)
                            }
                        });
                    }
                } catch (err) {
                    console.warn(`[LeetCode] Submission sync failed for ${sub.titleSlug}:`, err.message);
                }
            }));
        }

        res.json({ 
            message: 'LeetCode account connected and history synchronized', 
            stats,
            syncedCount: recentSubmissions.length
        });
    } catch (err) {
        console.error("Connect error:", err);
        if (err.code === 'P2002') {
            return res.status(400).json({ error: 'This LeetCode handle is already linked to another account.' });
        }
        res.status(500).json({ error: 'Failed to connect LeetCode account' });
    }
});

// Endpoint for Chrome Extension to sync a single solved problem (Secured)
router.post('/sync-submission', authMiddleware, async (req, res) => {
    const { slug, timestamp } = req.body;
    const userId = req.user.id;
    
    try {

        // Ensure we have metadata for this problem
        let problem = await prisma.problem.findUnique({ where: { slug } });
        
        if (!problem) {
            // The fetchProblemDetail import is now at the top of the file
            const detail = await fetchProblemDetail(slug);
            if (detail) {
                problem = await prisma.problem.create({
                    data: {
                        slug,
                        title: detail.title,
                        difficulty: detail.difficulty
                    }
                });
            } else {
                // Fallback placeholder
                problem = await prisma.problem.create({
                    data: {
                        slug,
                        title: slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                        difficulty: 'Medium'
                    }
                });
            }
        }

        const solvedProblem = await prisma.solvedProblem.create({
            data: {
                userId: userId,
                problemSlug: slug,
                solvedAt: new Date(timestamp)
            }
        });

        res.json({ message: 'Submission synced successfully', solved: solvedProblem });
    } catch (err) {
        console.error("Sync error:", err);
        res.status(500).json({ error: 'Failed to sync submission' });
    }
});

module.exports = router;
