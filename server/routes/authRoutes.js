
import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';

const router = express.Router();

// Initiate Google OAuth authentication.
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
}));


router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    authController.googleCallback
);

router.get('/failure', authController.failure);

router.get('/current_user', authController.currentUser);

router.get('/logout', authController.logout);

export default router;
