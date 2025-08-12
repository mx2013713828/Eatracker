import { Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';

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

// 用户删除自己的账户
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    // 开始事务，确保数据一致性
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. 查找用户
      const user = await User.findById(userId).session(session);
      if (!user) {
        await session.abortTransaction();
        return res.status(404).json({ message: '用户不存在' });
      }

      // 2. 删除用户相关的食材
      const Ingredient = require('../models/Ingredient').default;
      await Ingredient.deleteMany({ userId }).session(session);
      console.log(`删除了用户 ${userId} 的所有食材`);

      // 3. 删除用户记录
      await User.findByIdAndDelete(userId).session(session);

      // 提交事务
      await session.commitTransaction();

      console.log(`用户 ${user.username} 及其所有相关数据已被删除`);
      res.json({ 
        message: '用户账户及所有相关数据已成功删除',
        deletedUser: {
          username: user.username,
          name: user.name
        }
      });

    } catch (error) {
      // 如果出错，回滚事务
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('删除用户时发生错误:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
};

// 管理员删除指定用户的方法
export const deleteUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // 验证用户ID格式
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: '无效的用户ID' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. 删除用户记录
      const deletedUser = await User.findByIdAndDelete(userId).session(session);
      if (!deletedUser) {
        await session.abortTransaction();
        return res.status(404).json({ message: '用户不存在' });
      }

      // 2. 删除用户相关的其他数据（未来扩展时需要）
      // TODO: 添加其他相关数据的删除逻辑

      await session.commitTransaction();

      console.log(`管理员删除了用户 ${deletedUser.username} 及其所有相关数据`);
      res.json({ 
        message: '用户账户及所有相关数据已成功删除',
        deletedUser: {
          id: deletedUser._id,
          username: deletedUser.username,
          name: deletedUser.name
        }
      });

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

  } catch (error) {
    console.error('管理员删除用户时发生错误:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
}; 