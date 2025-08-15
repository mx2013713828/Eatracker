/**
 * 营养数据控制器
 * 提供食材营养信息搜索API
 */
import { Request, Response } from 'express';
import nutritionDataService from '../services/nutritionDataService';
import { getAllSupportedFoods } from '../data/nutritionDatabase';

/**
 * 搜索食材营养信息
 */
export const searchFoodNutrition = async (req: Request, res: Response) => {
  try {
    const { foodName } = req.query;

    if (!foodName || typeof foodName !== 'string') {
      return res.status(400).json({ 
        message: '请提供食材名称',
        example: '/api/nutrition/search?foodName=苹果'
      });
    }

    console.log(`搜索食材营养信息: ${foodName}`);
    
    const results = await nutritionDataService.searchFoodNutrition(foodName);
    
    if (results.length === 0) {
      return res.status(404).json({
        message: '未找到相关食材营养信息',
        suggestions: [
          '请尝试使用更具体的食材名称',
          '检查食材名称拼写是否正确',
          '可以尝试搜索相似的食材'
        ]
      });
    }

    res.json({
      success: true,
      query: foodName,
      count: results.length,
      results: results.map(result => ({
        ...result,
        // 为前端提供友好的数据格式
        nutritionFormatted: {
          calories: `${result.nutrition.calories} kcal`,
          protein: `${result.nutrition.protein} g`,
          carbs: `${result.nutrition.carbs} g`, 
          fat: `${result.nutrition.fat} g`,
          fiber: `${result.nutrition.fiber} g`,
          confidence: `${Math.round(result.nutrition.confidence * 100)}%`
        }
      }))
    });

  } catch (error) {
    console.error('搜索食材营养信息失败:', error);
    res.status(500).json({ 
      message: '搜索失败，请稍后重试',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
};

/**
 * 获取营养建议
 */
export const getNutritionSuggestions = async (req: Request, res: Response) => {
  try {
    const { foodName } = req.query;

    if (!foodName || typeof foodName !== 'string') {
      return res.status(400).json({ 
        message: '请提供食材名称' 
      });
    }

    const suggestions = await nutritionDataService.getNutritionSuggestions(foodName);
    
    res.json({
      success: true,
      foodName,
      suggestions
    });

  } catch (error) {
    console.error('获取营养建议失败:', error);
    res.status(500).json({ 
      message: '获取建议失败，请稍后重试' 
    });
  }
};

/**
 * 获取支持的食材列表
 */
export const getSupportedFoods = async (req: Request, res: Response) => {
  try {
    // 使用扩展数据库的食材列表
    const supportedFoods = getAllSupportedFoods();

    res.json({
      success: true,
      message: '扩展数据库支持的食材列表',
      count: supportedFoods.length,
      foods: supportedFoods.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
      categories: Array.from(new Set(supportedFoods.map(f => f.category))).sort(),
      note: '包含45+种食材，涵盖水果、蔬菜、肉类、海鲜、蛋奶、谷物、豆类、坚果、调料等分类'
    });

  } catch (error) {
    console.error('获取支持食材列表失败:', error);
    res.status(500).json({ 
      message: '获取失败，请稍后重试' 
    });
  }
}; 