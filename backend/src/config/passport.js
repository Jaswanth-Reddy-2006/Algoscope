const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("[Auth] Missing Google OAuth credentials. Google login will be disabled.");
} else {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const googleId = profile.id;
    
            let user = await prisma.user.findUnique({
                where: { googleId }
            });
    
            if (!user) {
                // Check if user exists with the same email
                user = await prisma.user.findUnique({
                    where: { email }
                });
    
                if (user) {
                    // Link Google ID to existing account
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: { googleId }
                    });
                } else {
                    // Create new user
                    user = await prisma.user.create({
                        data: {
                            googleId,
                            email,
                            username: profile.displayName || email.split('@')[0],
                            experience: 'beginner',
                            language: 'javascript'
                        }
                    });
                }
            }
    
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
      }
    ));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
