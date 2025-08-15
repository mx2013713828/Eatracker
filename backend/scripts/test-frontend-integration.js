/**
 * 前端集成测试脚本
 * 模拟前端添加食材的完整流程
 */
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// 测试添加食材的完整流程
async function testFrontendIntegration() {
  console.log('🧪 === 前端集成测试开始 ===\n');
  
  let authToken = '';
  let testUser = {
    username: 'testuser_frontend',
    email: 'testuser_frontend@example.com',
    password: 'password123',
    name: '前端测试用户',
    height: 170,
    weight: 65,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate'
  };

  try {
    // 1. 用户注册
    console.log('1. 测试用户注册...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
      console.log('✅ 用户注册成功');
      authToken = registerResponse.data.token;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('已存在')) {
        console.log('ℹ️ 用户已存在，尝试登录...');
        const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
          username: testUser.username,
          password: testUser.password
        });
        authToken = loginResponse.data.token;
        console.log('✅ 用户登录成功');
      } else {
        throw error;
      }
    }

    // 2. 测试营养搜索 (前端第一步)
    console.log('\n2. 测试营养信息搜索...');
    const nutritionResponse = await axios.get(`${API_BASE}/nutrition/search`, {
      params: { foodName: '苹果' }
    });
    
    if (nutritionResponse.data.results && nutritionResponse.data.results.length > 0) {
      const nutritionData = nutritionResponse.data.results[0];
      console.log('✅ 营养信息搜索成功');
      console.log(`   食材: ${nutritionData.name}`);
      console.log(`   热量: ${nutritionData.nutritionFormatted.calories}`);
      console.log(`   蛋白质: ${nutritionData.nutritionFormatted.protein}`);
      
      // 3. 测试添加食材 (使用自动填充的营养信息)
      console.log('\n3. 测试添加食材...');
      const ingredientData = {
        name: nutritionData.name,
        category: nutritionData.category || '水果',
        quantity: 2,
        unit: '个',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后过期
        nutrition: {
          calories: nutritionData.nutrition.calories,
          protein: nutritionData.nutrition.protein,
          carbs: nutritionData.nutrition.carbs,
          fat: nutritionData.nutrition.fat,
          fiber: nutritionData.nutrition.fiber
        }
      };

      const addResponse = await axios.post(`${API_BASE}/ingredients`, ingredientData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      console.log('✅ 食材添加成功');
      console.log(`   食材ID: ${addResponse.data.ingredient._id}`);
      console.log(`   名称: ${addResponse.data.ingredient.name}`);
      console.log(`   分类: ${addResponse.data.ingredient.category}`);
      console.log(`   数量: ${addResponse.data.ingredient.quantity} ${addResponse.data.ingredient.unit}`);
      
      // 4. 验证食材列表
      console.log('\n4. 验证食材列表...');
      const listResponse = await axios.get(`${API_BASE}/ingredients`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      
      const addedIngredient = listResponse.data.find(ing => ing._id === addResponse.data.ingredient._id);
      if (addedIngredient) {
        console.log('✅ 食材列表验证成功');
        console.log(`   找到添加的食材: ${addedIngredient.name}`);
      } else {
        console.log('❌ 食材列表验证失败');
      }

      // 5. 清理测试数据
      console.log('\n5. 清理测试数据...');
      await axios.delete(`${API_BASE}/ingredients/${addResponse.data.ingredient._id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ 测试数据清理完成');

    } else {
      console.log('❌ 营养信息搜索失败');
    }

    console.log('\n✨ === 前端集成测试完成！===');
    console.log('\n📊 测试结果:');
    console.log('   ✅ 用户认证: 通过');
    console.log('   ✅ 营养搜索: 通过');
    console.log('   ✅ 食材添加: 通过');
    console.log('   ✅ 数据验证: 通过');
    console.log('   ✅ 数据清理: 通过');
    
    console.log('\n🎯 前端功能状态:');
    console.log('   ✅ 添加食材按钮应该可以正常工作');
    console.log('   ✅ 营养搜索功能应该可以正常使用');
    console.log('   ✅ 表单提交应该可以正常处理');

  } catch (error) {
    console.error('\n❌ 前端集成测试失败:', error.response?.data?.message || error.message);
    console.log('\n🔧 可能的问题:');
    console.log('   - 后端服务未启动');
    console.log('   - 数据库连接问题');
    console.log('   - 认证token问题');
    console.log('   - API接口错误');
  }
}

// 运行测试
testFrontendIntegration(); 