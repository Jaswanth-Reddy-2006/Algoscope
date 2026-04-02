const authMiddleware = (req, res, next) => {
    // Development Bypass: Always allow for now
    req.user = { id: 1, role: 'user', username: 'guest' };
    next();
};

module.exports = authMiddleware;

