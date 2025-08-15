/**
 * 营养数据路由
 * 提供食材营养信息相关的API端点
 */
import express from 'express';
import { 
  searchFoodNutrition, 
  getNutritionSuggestions, 
  getSupportedFoods 
} from '../controllers/nutrition.controller';

const router = express.Router();

// 搜索食材营养信息
// GET /api/nutrition/search?foodName=苹果
router.get('/search', searchFoodNutrition);

// 获取营养建议
// GET /api/nutrition/suggestions?foodName=苹果
router.get('/suggestions', getNutritionSuggestions);

// 获取支持的食材列表
// GET /api/nutrition/foods
router.get('/foods', getSupportedFoods);

export default router; 