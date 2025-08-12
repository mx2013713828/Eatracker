import express from 'express';
import { getUserProfile, updateUserProfile, deleteUser } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// 用户删除自己的账户
router.delete('/profile', auth, deleteUser);

export default router; 