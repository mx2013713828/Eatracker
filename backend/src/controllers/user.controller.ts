import { Request, Response } from 'express';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { age, height, weight, name } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 更新用户信息
    if (age !== undefined) user.age = age;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (name !== undefined) user.name = name;
    
    user.lastUpdated = new Date();
    await user.save();

    // 返回更新后的用户信息（不包含密码）
    const updatedUser = await User.findById(userId).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}; 