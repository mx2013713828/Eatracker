import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 食材接口定义
export interface Ingredient {
  _id?: string;
  userId?: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
}

// 创建axios实例，自动添加认证token
const apiClient = axios.create({
  baseURL: `${API_URL}/ingredients`,
});

// 请求拦截器，自动添加token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器，处理认证错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ingredientService = {
  // 获取所有食材
  getIngredients: async (): Promise<Ingredient[]> => {
    const response = await apiClient.get('/');
    return response.data;
  },

  // 添加食材
  addIngredient: async (ingredient: Omit<Ingredient, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Ingredient> => {
    const response = await apiClient.post('/', ingredient);
    return response.data.ingredient;
  },

  // 更新食材
  updateIngredient: async (ingredientId: string, ingredient: Partial<Ingredient>): Promise<Ingredient> => {
    const response = await apiClient.put(`/${ingredientId}`, ingredient);
    return response.data.ingredient;
  },

  // 删除食材
  deleteIngredient: async (ingredientId: string): Promise<void> => {
    await apiClient.delete(`/${ingredientId}`);
  },

  // 获取单个食材
  getIngredientById: async (ingredientId: string): Promise<Ingredient> => {
    const response = await apiClient.get(`/${ingredientId}`);
    return response.data;
  },

  // 获取即将过期的食材
  getExpiringIngredients: async (days: number = 7): Promise<Ingredient[]> => {
    const response = await apiClient.get(`/expiring?days=${days}`);
    return response.data;
  },
}; 