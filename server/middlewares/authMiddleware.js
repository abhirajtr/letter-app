// backend/middlewares/authMiddleware.js

/**
 * ensureAuthenticated: Middleware to check if a user is logged in.
 * If authenticated, proceeds to the next middleware; otherwise, returns a 401 error.
 */
export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};
