import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('收到注册请求:', req.body);
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
      console.log('注册信息不完整');
      return res.status(400).json({ message: '请填写所有必需信息' });
    }

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('用户名已存在:', username);
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建新用户
    console.log('开始创建新用户...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      name,
      role: 'parent', // 默认角色
      dailyCalorieNeeds: 2000, // 默认值
      nutritionNeeds: {
        protein: 60,
        carbs: 250,
        fat: 70,
        fiber: 25,
      },
    });

    await user.save();
    console.log('用户创建成功:', user._id);

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    console.log('注册成功，返回响应');
    res.status(201).json({
      message: '注册成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('注册过程中发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
}; 