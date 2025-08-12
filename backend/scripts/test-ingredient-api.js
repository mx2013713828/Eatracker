/**
 * 食材API测试脚本
 */
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// 测试数据
const testUser = {
  username: 'testuser',
  password: 'test123',
  name: '测试用户'
};

const testIngredient = {
  name: '苹果',
  category: '水果',
  quantity: 5,
  unit: '个',
  nutrition: {
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4
  },
  expiryDate: new Date('2024-12-31').toISOString()
};

let authToken = '';

// 测试函数
async function testIngredientAPI() {
  try {
    console.log('=== 食材API测试开始 ===\n');

    // 1. 注册测试用户
    console.log('1. 注册测试用户...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
      authToken = registerResponse.data.token;
      console.log('✅ 用户注册成功');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === '用户名已存在') {
        // 用户已存在，尝试登录
        console.log('用户已存在，尝试登录...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, testUser);
        authToken = loginResponse.data.token;
        console.log('✅ 用户登录成功');
      } else {
        throw error;
      }
    }

    // 设置请求头
    const config = {
      headers: { Authorization: `Bearer ${authToken}` }
    };

    // 2. 获取食材列表（应该为空）
    console.log('\n2. 获取食材列表...');
    const getResponse1 = await axios.get(`${API_BASE}/ingredients`, config);
    console.log(`✅ 获取食材列表成功，当前有 ${getResponse1.data.length} 个食材`);

    // 3. 添加食材
    console.log('\n3. 添加食材...');
    const addResponse = await axios.post(`${API_BASE}/ingredients`, testIngredient, config);
    console.log('✅ 添加食材成功:', addResponse.data.ingredient.name);

    // 4. 再次获取食材列表
    console.log('\n4. 再次获取食材列表...');
    const getResponse2 = await axios.get(`${API_BASE}/ingredients`, config);
    console.log(`✅ 获取食材列表成功，当前有 ${getResponse2.data.length} 个食材`);
    console.log('食材详情:', getResponse2.data[0]);

    // 5. 更新食材
    const ingredientId = getResponse2.data[0]._id;
    console.log('\n5. 更新食材...');
    const updateData = {
      quantity: 8,
      nutrition: {
        calories: 55,
        protein: 0.3,
        carbs: 14,
        fat: 0.2,
        fiber: 2.4
      }
    };
    const updateResponse = await axios.put(`${API_BASE}/ingredients/${ingredientId}`, updateData, config);
    console.log('✅ 更新食材成功，新数量:', updateResponse.data.ingredient.quantity);

    // 6. 获取单个食材
    console.log('\n6. 获取单个食材...');
    const getOneResponse = await axios.get(`${API_BASE}/ingredients/${ingredientId}`, config);
    console.log('✅ 获取单个食材成功:', getOneResponse.data.name);

    // 7. 删除食材
    console.log('\n7. 删除食材...');
    await axios.delete(`${API_BASE}/ingredients/${ingredientId}`, config);
    console.log('✅ 删除食材成功');

    // 8. 确认删除
    console.log('\n8. 确认删除...');
    const getResponse3 = await axios.get(`${API_BASE}/ingredients`, config);
    console.log(`✅ 确认删除成功，当前有 ${getResponse3.data.length} 个食材`);

    console.log('\n=== 所有测试通过！ ===');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
  }
}

// 运行测试
testIngredientAPI(); 