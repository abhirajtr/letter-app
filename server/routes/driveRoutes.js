import express from 'express';
import driveController from '../controllers/driveController.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/save-letter', ensureAuthenticated, driveController.saveLetter);

export default router;
