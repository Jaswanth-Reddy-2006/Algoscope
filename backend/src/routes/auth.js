const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'algoscope_secret_key_change_me';

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  async (req, res) => {
    let user = req.user;
    
    // Auto-repair missing fields if any
    if (!user.username || !user.experience || !user.language) {
        try {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    username: user.username || user.email.split('@')[0],
                    experience: user.experience || 'beginner',
                    language: user.language || 'javascript'
                }
            });
        } catch (err) {
            console.error("Failed to auto-repair user fields", err);
        }
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    
    // Redirect back to frontend with token and user info
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    
    res.redirect(redirectUrl);
  }
);

// Local Register
router.post('/register', async (req, res) => {
    const { username, email, password, experience, language } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email or username' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                experience: experience || 'beginner',
                language: language || 'javascript'
            }
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, username, email, experience: user.experience, language: user.language } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Local Login
router.post('/login', async (req, res) => {
    const { login, password } = req.body; // login can be username or email

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: login },
                    { username: login }
                ]
            }
        });

        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { 
            id: user.id, 
            username: user.username, 
            email: user.email,
            experience: user.experience,
            language: user.language
        } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
