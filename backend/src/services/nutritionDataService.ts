/**
 * 营养数据服务 - 整合多个营养数据源
 * 支持自动获取食材营养成分信息
 */
import axios from 'axios';
// 使用独立的营养数据库 - 包含45+种食材
import { chineseFoodDatabase, getFoodCategory, getAllSupportedFoods, NutritionData } from '../data/nutritionDatabase';

// 食材搜索结果接口
export interface FoodSearchResult {
  id: string;
  name: string;
  description?: string;
  category?: string;
  nutrition: NutritionData;
  source: string;
}

class NutritionDataService {
  private usdaApiKey: string;
  private usdaBaseUrl = 'https://api.nal.usda.gov/fdc/v1';
  
  // 使用扩展的45+种食材数据库
  private chineseFoodData = new Map(Object.entries(chineseFoodDatabase));

  constructor() {
    this.usdaApiKey = process.env.USDA_API_KEY || '';
  }

  /**
   * 搜索食材营养信息 - 支持多数据源
   */
  async searchFoodNutrition(foodName: string): Promise<FoodSearchResult[]> {
    const results: FoodSearchResult[] = [];
    
    try {
      // 1. 优先查找本地中文数据
      const localResult = this.searchLocalChineseFood(foodName);
      if (localResult) {
        results.push(localResult);
      }

      // 2. 如果本地没有数据，尝试USDA API
      if (results.length === 0 && this.usdaApiKey) {
        const usdaResults = await this.searchUSDAFood(foodName);
        results.push(...usdaResults);
      }

      // 3. 如果仍然没有数据，使用智能匹配
      if (results.length === 0) {
        const smartResult = this.smartFoodMatching(foodName);
        if (smartResult) {
          results.push(smartResult);
        }
      }

      return results;
    } catch (error) {
      console.error('搜索食材营养信息失败:', error);
      return [];
    }
  }

  /**
   * 搜索本地中文食材数据
   */
  private searchLocalChineseFood(foodName: string): FoodSearchResult | null {
    // 精确匹配
    if (this.chineseFoodData.has(foodName)) {
      const nutrition = this.chineseFoodData.get(foodName)!;
      return {
        id: `local_${foodName}`,
        name: foodName,
        description: `本地数据库中的${foodName}`,
        category: this.getCategoryByFoodName(foodName),
        nutrition,
        source: 'local'
      };
    }

    // 模糊匹配
    for (const [key, nutrition] of this.chineseFoodData) {
      if (key.includes(foodName) || foodName.includes(key)) {
        return {
          id: `local_${key}`,
          name: key,
          description: `模糊匹配：${key} (搜索词：${foodName})`,
          category: this.getCategoryByFoodName(key),
          nutrition: { ...nutrition, confidence: nutrition.confidence * 0.8 },
          source: 'local_fuzzy'
        };
      }
    }

    return null;
  }

  /**
   * 搜索USDA食材数据
   */
  private async searchUSDAFood(foodName: string): Promise<FoodSearchResult[]> {
    if (!this.usdaApiKey) {
      console.warn('USDA API Key 未配置');
      return [];
    }

    try {
      const response = await axios.get(`${this.usdaBaseUrl}/foods/search`, {
        params: {
          api_key: this.usdaApiKey,
          query: foodName,
          dataType: 'Foundation,SR Legacy',
          pageSize: 3
        },
        timeout: 5000
      });

      const foods = response.data.foods || [];
      return foods.map((food: any) => this.parseUSDAFood(food));
    } catch (error) {
      console.error('USDA API 请求失败:', error);
      return [];
    }
  }

  /**
   * 解析USDA食材数据
   */
  private parseUSDAFood(usdaFood: any): FoodSearchResult {
    const nutrients = usdaFood.foodNutrients || [];
    
    // 提取主要营养成分
    const nutrition: NutritionData = {
      calories: this.extractNutrient(nutrients, 'Energy', 'KCAL') || 0,
      protein: this.extractNutrient(nutrients, 'Protein') || 0,
      carbs: this.extractNutrient(nutrients, 'Carbohydrate, by difference') || 0,
      fat: this.extractNutrient(nutrients, 'Total lipid (fat)') || 0,
      fiber: this.extractNutrient(nutrients, 'Fiber, total dietary') || 0,
      source: 'usda',
      confidence: 0.95
    };

    return {
      id: `usda_${usdaFood.fdcId}`,
      name: usdaFood.description,
      description: `USDA数据库: ${usdaFood.description}`,
      category: usdaFood.foodCategory || 'unknown',
      nutrition,
      source: 'usda'
    };
  }

  /**
   * 从USDA营养成分数组中提取特定营养素
   */
  private extractNutrient(nutrients: any[], nutrientName: string, unitName?: string): number {
    const nutrient = nutrients.find((n: any) => 
      n.nutrientName?.toLowerCase().includes(nutrientName.toLowerCase()) &&
      (!unitName || n.unitName?.toLowerCase() === unitName.toLowerCase())
    );
    return nutrient ? parseFloat(nutrient.value) || 0 : 0;
  }

  /**
   * 智能食材匹配 - 基于关键词和分类
   */
  private smartFoodMatching(foodName: string): FoodSearchResult | null {
    // 水果类关键词
    if (['果', '莓', '桃', '梨', '橙', '柚', '葡萄'].some(keyword => foodName.includes(keyword))) {
      return {
        id: `smart_fruit_${foodName}`,
        name: foodName,
        description: `智能匹配：水果类食材`,
        category: '水果',
        nutrition: { calories: 50, protein: 0.5, carbs: 12, fat: 0.2, fiber: 2, source: 'estimated', confidence: 0.6 },
        source: 'smart_matching'
      };
    }

    // 蔬菜类关键词
    if (['菜', '瓜', '豆', '菇', '笋'].some(keyword => foodName.includes(keyword))) {
      return {
        id: `smart_vegetable_${foodName}`,
        name: foodName,
        description: `智能匹配：蔬菜类食材`,
        category: '蔬菜',
        nutrition: { calories: 25, protein: 2, carbs: 5, fat: 0.2, fiber: 2, source: 'estimated', confidence: 0.6 },
        source: 'smart_matching'
      };
    }

    // 肉类关键词
    if (['肉', '鸡', '鸭', '鱼', '虾', '蟹'].some(keyword => foodName.includes(keyword))) {
      return {
        id: `smart_meat_${foodName}`,
        name: foodName,
        description: `智能匹配：肉类食材`,
        category: '肉类',
        nutrition: { calories: 200, protein: 25, carbs: 0, fat: 10, fiber: 0, source: 'estimated', confidence: 0.6 },
        source: 'smart_matching'
      };
    }

    return null;
  }

  /**
   * 根据食材名称判断分类
   */
  private getCategoryByFoodName(foodName: string): string {
    return getFoodCategory(foodName);
  }

  /**
   * 获取营养建议
   */
  async getNutritionSuggestions(foodName: string): Promise<string[]> {
    const results = await this.searchFoodNutrition(foodName);
    const suggestions: string[] = [];

    if (results.length > 0) {
      const nutrition = results[0].nutrition;
      
      if (nutrition.protein > 20) {
        suggestions.push('富含蛋白质，适合健身人群');
      }
      if (nutrition.fiber > 3) {
        suggestions.push('高纤维食物，有助消化');
      }
      if (nutrition.calories < 50) {
        suggestions.push('低热量食物，适合减重期间');
      }
      if (nutrition.fat < 1) {
        suggestions.push('低脂肪食物，健康选择');
      }
    }

    return suggestions;
  }
}

export default new NutritionDataService(); 