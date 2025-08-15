/**
 * 营养数据服务
 * 与后端营养API通信
 */
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 营养搜索结果接口
export interface NutritionSearchResult {
  id: string;
  name: string;
  description?: string;
  category?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    source: string;
    confidence: number;
  };
  nutritionFormatted: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    confidence: string;
  };
  source: string;
}

// 支持的食材接口
export interface SupportedFood {
  name: string;
  category: string;
  confidence: number;
}

// 创建axios实例
const apiClient = axios.create({
  baseURL: `${API_URL}/nutrition`,
});

export const nutritionService = {
  /**
   * 搜索食材营养信息
   */
  searchFoodNutrition: async (foodName: string): Promise<NutritionSearchResult[]> => {
    try {
      const response = await apiClient.get('/search', {
        params: { foodName }
      });
      return response.data.results || [];
    } catch (error: any) {
      console.error('搜索营养信息失败:', error);
      if (error.response?.status === 404) {
        return []; // 没找到数据返回空数组
      }
      throw new Error(error.response?.data?.message || '搜索失败');
    }
  },

  /**
   * 获取营养建议
   */
  getNutritionSuggestions: async (foodName: string): Promise<string[]> => {
    try {
      const response = await apiClient.get('/suggestions', {
        params: { foodName }
      });
      return response.data.suggestions || [];
    } catch (error: any) {
      console.error('获取营养建议失败:', error);
      return [];
    }
  },

  /**
   * 获取支持的食材列表
   */
  getSupportedFoods: async (): Promise<SupportedFood[]> => {
    try {
      const response = await apiClient.get('/foods');
      return response.data.foods || [];
    } catch (error: any) {
      console.error('获取支持食材列表失败:', error);
      return [];
    }
  },

  /**
   * 智能食材名称建议
   */
  getFoodNameSuggestions: (input: string, supportedFoods: SupportedFood[]): string[] => {
    if (!input || input.length < 1) return [];
    
    const suggestions = supportedFoods
      .filter(food => food.name.includes(input))
      .map(food => food.name)
      .slice(0, 5);
    
    return suggestions;
  }
}; 