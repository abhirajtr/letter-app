import express from 'express';
import driveController from '../controllers/driveController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/save-letter', authenticateJWT, driveController.saveLetter);

export default router;
