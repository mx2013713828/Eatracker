/**
 * 中文食材营养数据库
 * 数据来源：中国食物成分表、USDA数据库等权威来源
 * 单位：每100g食材的营养成分
 */

export interface NutritionData {
  calories: number;   // 热量 (kcal)
  protein: number;    // 蛋白质 (g)
  carbs: number;      // 碳水化合物 (g)
  fat: number;        // 脂肪 (g)
  fiber: number;      // 纤维 (g)
  source: string;     // 数据来源
  confidence: number; // 可信度 (0-1)
}

// 基础食材营养数据库
export const chineseFoodDatabase: Record<string, NutritionData> = {
  // === 水果类 ===
  '苹果': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, source: 'local', confidence: 0.9 },
  '香蕉': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, source: 'local', confidence: 0.9 },
  '橙子': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1, fiber: 2.4, source: 'local', confidence: 0.85 },
  '葡萄': { calories: 67, protein: 0.6, carbs: 17, fat: 0.2, fiber: 0.9, source: 'local', confidence: 0.85 },
  '梨': { calories: 57, protein: 0.4, carbs: 15, fat: 0.1, fiber: 3.1, source: 'local', confidence: 0.85 },
  '桃子': { calories: 39, protein: 0.9, carbs: 9.5, fat: 0.3, fiber: 1.5, source: 'local', confidence: 0.85 },
  '西瓜': { calories: 30, protein: 0.6, carbs: 8, fat: 0.2, fiber: 0.4, source: 'local', confidence: 0.8 },
  '草莓': { calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2, source: 'local', confidence: 0.85 },

  // === 蔬菜类 ===
  '西兰花': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, source: 'local', confidence: 0.9 },
  '胡萝卜': { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8, source: 'local', confidence: 0.9 },
  '土豆': { calories: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2, source: 'local', confidence: 0.9 },
  '白菜': { calories: 16, protein: 1.5, carbs: 3.2, fat: 0.2, fiber: 1.2, source: 'local', confidence: 0.85 },
  '番茄': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2, source: 'local', confidence: 0.9 },
  '黄瓜': { calories: 16, protein: 0.7, carbs: 4, fat: 0.1, fiber: 0.5, source: 'local', confidence: 0.85 },
  '菠菜': { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, source: 'local', confidence: 0.9 },
  '韭菜': { calories: 22, protein: 2.4, carbs: 4.6, fat: 0.2, fiber: 1.4, source: 'local', confidence: 0.8 },
  '茄子': { calories: 25, protein: 1, carbs: 5.9, fat: 0.2, fiber: 3, source: 'local', confidence: 0.85 },
  '冬瓜': { calories: 11, protein: 0.4, carbs: 2.6, fat: 0.2, fiber: 0.7, source: 'local', confidence: 0.8 },

  // === 肉类 ===
  '鸡胸肉': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, source: 'local', confidence: 0.95 },
  '猪肉': { calories: 242, protein: 27, carbs: 0, fat: 14, fiber: 0, source: 'local', confidence: 0.9 },
  '牛肉': { calories: 250, protein: 26, carbs: 0, fat: 15, fiber: 0, source: 'local', confidence: 0.9 },
  '羊肉': { calories: 203, protein: 25, carbs: 0, fat: 11, fiber: 0, source: 'local', confidence: 0.85 },
  '鸡腿肉': { calories: 216, protein: 24, carbs: 0, fat: 12, fiber: 0, source: 'local', confidence: 0.9 },

  // === 海鲜类 ===
  '鲫鱼': { calories: 108, protein: 17, carbs: 0, fat: 4.2, fiber: 0, source: 'local', confidence: 0.85 },
  '带鱼': { calories: 127, protein: 17, carbs: 0, fat: 6.1, fiber: 0, source: 'local', confidence: 0.85 },
  '虾': { calories: 87, protein: 18, carbs: 0, fat: 1.2, fiber: 0, source: 'local', confidence: 0.9 },
  '蟹': { calories: 95, protein: 19, carbs: 0, fat: 1.9, fiber: 0, source: 'local', confidence: 0.85 },

  // === 蛋奶类 ===
  '鸡蛋': { calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, source: 'local', confidence: 0.95 },
  '牛奶': { calories: 64, protein: 3.2, carbs: 4.8, fat: 3.6, fiber: 0, source: 'local', confidence: 0.9 },
  '酸奶': { calories: 99, protein: 3.5, carbs: 12, fat: 4.3, fiber: 0, source: 'local', confidence: 0.85 },
  '奶酪': { calories: 328, protein: 25, carbs: 2.1, fat: 25, fiber: 0, source: 'local', confidence: 0.85 },

  // === 谷物类 ===
  '米饭': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, source: 'local', confidence: 0.9 },
  '面条': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, source: 'local', confidence: 0.85 },
  '面包': { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.8, source: 'local', confidence: 0.85 },
  '燕麦': { calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7, source: 'local', confidence: 0.9 },
  '小米': { calories: 358, protein: 9.7, carbs: 76, fat: 3.1, fiber: 1.6, source: 'local', confidence: 0.85 },

  // === 豆类 ===
  '豆腐': { calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.4, source: 'local', confidence: 0.9 },
  '豆浆': { calories: 14, protein: 1.8, carbs: 1.1, fat: 0.7, fiber: 0.1, source: 'local', confidence: 0.85 },
  '红豆': { calories: 324, protein: 21, carbs: 64, fat: 0.6, fiber: 7.7, source: 'local', confidence: 0.85 },
  '绿豆': { calories: 329, protein: 22, carbs: 62, fat: 0.8, fiber: 6.4, source: 'local', confidence: 0.85 },
  '黄豆': { calories: 359, protein: 35, carbs: 34, fat: 16, fiber: 15, source: 'local', confidence: 0.9 },

  // === 坚果类 ===
  '花生': { calories: 567, protein: 26, carbs: 16, fat: 49, fiber: 8.5, source: 'local', confidence: 0.9 },
  '核桃': { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 6.7, source: 'local', confidence: 0.85 },
  '杏仁': { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, source: 'local', confidence: 0.85 },

  // === 调料类 ===
  '大蒜': { calories: 126, protein: 4.5, carbs: 28, fat: 0.2, fiber: 1.2, source: 'local', confidence: 0.8 },
  '生姜': { calories: 19, protein: 0.9, carbs: 4, fat: 0.2, fiber: 1.2, source: 'local', confidence: 0.8 },
  '葱': { calories: 30, protein: 1.2, carbs: 7, fat: 0.1, fiber: 2.2, source: 'local', confidence: 0.8 }
};

// 食材分类映射
export const foodCategories: Record<string, string[]> = {
  '水果': ['苹果', '香蕉', '橙子', '葡萄', '梨', '桃子', '西瓜', '草莓'],
  '蔬菜': ['西兰花', '胡萝卜', '土豆', '白菜', '番茄', '黄瓜', '菠菜', '韭菜', '茄子', '冬瓜'],
  '肉类': ['鸡胸肉', '猪肉', '牛肉', '羊肉', '鸡腿肉'],
  '海鲜': ['鲫鱼', '带鱼', '虾', '蟹'],
  '蛋奶': ['鸡蛋', '牛奶', '酸奶', '奶酪'],
  '谷物': ['米饭', '面条', '面包', '燕麦', '小米'],
  '豆类': ['豆腐', '豆浆', '红豆', '绿豆', '黄豆'],
  '坚果': ['花生', '核桃', '杏仁'],
  '调料': ['大蒜', '生姜', '葱']
};

// 获取食材分类
export function getFoodCategory(foodName: string): string {
  for (const [category, foods] of Object.entries(foodCategories)) {
    if (foods.includes(foodName)) {
      return category;
    }
  }
  return '其他';
}

// 获取所有支持的食材列表
export function getAllSupportedFoods(): Array<{name: string, category: string, confidence: number}> {
  return Object.entries(chineseFoodDatabase).map(([name, data]) => ({
    name,
    category: getFoodCategory(name),
    confidence: data.confidence
  }));
} 