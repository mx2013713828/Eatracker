import express from 'express';
import { 
  getUserIngredients, 
  addIngredient, 
  updateIngredient, 
  deleteIngredient, 
  getIngredientById,
  getExpiringIngredients
} from '../controllers/ingredient.controller';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

// 所有路由都需要认证
router.use(auth);

// 获取用户的所有食材
router.get('/', getUserIngredients);

// 获取即将过期的食材
router.get('/expiring', getExpiringIngredients);

// 获取单个食材详情
router.get('/:ingredientId', getIngredientById);

// 添加新食材
router.post('/', addIngredient);

// 更新食材
router.put('/:ingredientId', updateIngredient);

// 删除食材
router.delete('/:ingredientId', deleteIngredient);

export default router; 