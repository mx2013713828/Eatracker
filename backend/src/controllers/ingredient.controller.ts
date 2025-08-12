import { Request, Response } from 'express';
import Ingredient from '../models/Ingredient';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  userId: string;
}

// 获取用户的所有食材
export const getUserIngredients = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const ingredients = await Ingredient.find({ userId }).sort({ expiryDate: 1 });
    res.json(ingredients);
  } catch (error) {
    console.error('获取食材列表时发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 添加新食材
export const addIngredient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { name, category, quantity, unit, nutrition, expiryDate } = req.body;

    // 验证必填字段
    if (!name || !category || !quantity || !unit || !expiryDate) {
      return res.status(400).json({ message: '请填写所有必需信息' });
    }

    // 验证营养信息
    if (!nutrition || typeof nutrition !== 'object') {
      return res.status(400).json({ message: '请提供营养信息' });
    }

    const { calories, protein, carbs, fat, fiber } = nutrition;
    if (calories === undefined || protein === undefined || carbs === undefined || 
        fat === undefined || fiber === undefined) {
      return res.status(400).json({ message: '营养信息不完整' });
    }

    // 创建新食材
    const ingredient = new Ingredient({
      userId,
      name: name.trim(),
      category: category.trim(),
      quantity: Number(quantity),
      unit: unit.trim(),
      nutrition: {
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        fiber: Number(fiber)
      },
      expiryDate: new Date(expiryDate)
    });

    await ingredient.save();
    
    console.log(`用户 ${userId} 添加了食材: ${name}`);
    res.status(201).json({
      message: '食材添加成功',
      ingredient
    });

  } catch (error) {
    console.error('添加食材时发生错误:', error);
    res.status(500).json({ message: '添加食材失败' });
  }
};

// 更新食材
export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { ingredientId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
      return res.status(400).json({ message: '无效的食材ID' });
    }

    // 查找食材并验证所有权
    const ingredient = await Ingredient.findOne({ 
      _id: ingredientId, 
      userId 
    });

    if (!ingredient) {
      return res.status(404).json({ message: '食材不存在或无权限访问' });
    }

    const { name, category, quantity, unit, nutrition, expiryDate } = req.body;

    // 更新字段
    if (name !== undefined) ingredient.name = name.trim();
    if (category !== undefined) ingredient.category = category.trim();
    if (quantity !== undefined) ingredient.quantity = Number(quantity);
    if (unit !== undefined) ingredient.unit = unit.trim();
    if (expiryDate !== undefined) ingredient.expiryDate = new Date(expiryDate);

    // 更新营养信息
    if (nutrition && typeof nutrition === 'object') {
      if (nutrition.calories !== undefined) ingredient.nutrition.calories = Number(nutrition.calories);
      if (nutrition.protein !== undefined) ingredient.nutrition.protein = Number(nutrition.protein);
      if (nutrition.carbs !== undefined) ingredient.nutrition.carbs = Number(nutrition.carbs);
      if (nutrition.fat !== undefined) ingredient.nutrition.fat = Number(nutrition.fat);
      if (nutrition.fiber !== undefined) ingredient.nutrition.fiber = Number(nutrition.fiber);
    }

    await ingredient.save();

    console.log(`用户 ${userId} 更新了食材: ${ingredient.name}`);
    res.json({
      message: '食材更新成功',
      ingredient
    });

  } catch (error) {
    console.error('更新食材时发生错误:', error);
    res.status(500).json({ message: '更新食材失败' });
  }
};

// 删除食材
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { ingredientId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
      return res.status(400).json({ message: '无效的食材ID' });
    }

    // 先查找食材确保存在和有权限
    const ingredient = await Ingredient.findOne({ 
      _id: ingredientId, 
      userId 
    });

    if (!ingredient) {
      return res.status(404).json({ message: '食材不存在或无权限访问' });
    }

    // 删除食材
    await Ingredient.findByIdAndDelete(ingredientId);

    console.log(`用户 ${userId} 删除了食材: ${ingredient.name}`);
    res.json({
      message: '食材删除成功',
      deletedIngredient: {
        id: ingredient._id,
        name: ingredient.name
      }
    });

  } catch (error) {
    console.error('删除食材时发生错误:', error);
    res.status(500).json({ message: '删除食材失败' });
  }
};

// 获取单个食材详情
export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { ingredientId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    if (!mongoose.Types.ObjectId.isValid(ingredientId)) {
      return res.status(400).json({ message: '无效的食材ID' });
    }

    const ingredient = await Ingredient.findOne({ 
      _id: ingredientId, 
      userId 
    });

    if (!ingredient) {
      return res.status(404).json({ message: '食材不存在或无权限访问' });
    }

    res.json(ingredient);

  } catch (error) {
    console.error('获取食材详情时发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取即将过期的食材
export const getExpiringIngredients = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { days = 7 } = req.query; // 默认查找7天内过期的食材
    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + Number(days));

    const expiringIngredients = await Ingredient.find({ 
      userId,
      expiryDate: { $lte: expiryThreshold }
    }).sort({ expiryDate: 1 });

    res.json(expiringIngredients);

  } catch (error) {
    console.error('获取即将过期食材时发生错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
}; 