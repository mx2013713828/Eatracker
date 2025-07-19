import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

export default router; 