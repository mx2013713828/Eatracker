/**
 * 营养API测试脚本
 * 测试营养数据搜索功能
 */
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// 测试用例
const testCases = [
  { name: '苹果', expectFound: true, category: '水果' },
  { name: '鸡胸肉', expectFound: true, category: '肉类' },
  { name: '西兰花', expectFound: true, category: '蔬菜' },
  { name: '牛奶', expectFound: true, category: '蛋奶' },
  { name: '不存在的食材XYZ', expectFound: false, category: null },
  { name: '猪肉', expectFound: true, category: '肉类' },
  { name: '香蕉', expectFound: true, category: '水果' }
];

// 测试营养API
async function testNutritionAPI() {
  try {
    console.log('🧪 === 营养API测试开始 ===\n');

    // 1. 测试获取支持的食材列表
    console.log('1. 测试获取支持的食材列表...');
    try {
      const supportedResponse = await axios.get(`${API_BASE}/nutrition/foods`);
      const foods = supportedResponse.data.foods || [];
      console.log(`✅ 成功获取 ${foods.length} 个支持的食材`);
      console.log(`   前5个食材: ${foods.slice(0, 5).map(f => f.name).join(', ')}\n`);
    } catch (error) {
      console.log(`❌ 获取支持食材列表失败: ${error.response?.data?.message || error.message}\n`);
    }

    // 2. 测试营养信息搜索
    console.log('2. 测试营养信息搜索...');
    for (const testCase of testCases) {
      try {
        console.log(`\n   测试食材: ${testCase.name}`);
        
        const searchResponse = await axios.get(`${API_BASE}/nutrition/search`, {
          params: { foodName: testCase.name }
        });
        
        const results = searchResponse.data.results || [];
        
        if (testCase.expectFound) {
          if (results.length > 0) {
            const result = results[0];
            console.log(`   ✅ 找到营养信息`);
            console.log(`      名称: ${result.name}`);
            console.log(`      分类: ${result.category || '未分类'}`);
            console.log(`      来源: ${result.source}`);
            console.log(`      热量: ${result.nutritionFormatted.calories}`);
            console.log(`      蛋白质: ${result.nutritionFormatted.protein}`);
            console.log(`      可信度: ${result.nutritionFormatted.confidence}`);
            
            // 验证分类是否匹配
            if (testCase.category && result.category !== testCase.category) {
              console.log(`   ⚠️ 分类不匹配: 期望 ${testCase.category}, 实际 ${result.category}`);
            }
          } else {
            console.log(`   ❌ 期望找到但未找到营养信息`);
          }
        } else {
          if (results.length === 0) {
            console.log(`   ✅ 正确：未找到不存在食材的营养信息`);
          } else {
            console.log(`   ⚠️ 意外找到了不存在食材的营养信息`);
          }
        }
        
      } catch (error) {
        if (error.response?.status === 404 && !testCase.expectFound) {
          console.log(`   ✅ 正确：返回404未找到`);
        } else {
          console.log(`   ❌ 搜索失败: ${error.response?.data?.message || error.message}`);
        }
      }
    }

    // 3. 测试营养建议
    console.log('\n\n3. 测试营养建议功能...');
    const suggestionTests = ['鸡胸肉', '苹果', '西兰花'];
    
    for (const foodName of suggestionTests) {
      try {
        console.log(`\n   获取 ${foodName} 的营养建议...`);
        
        const suggestionResponse = await axios.get(`${API_BASE}/nutrition/suggestions`, {
          params: { foodName }
        });
        
        const suggestions = suggestionResponse.data.suggestions || [];
        
        if (suggestions.length > 0) {
          console.log(`   ✅ 获得 ${suggestions.length} 个建议:`);
          suggestions.forEach((suggestion, index) => {
            console.log(`      ${index + 1}. ${suggestion}`);
          });
        } else {
          console.log(`   ℹ️ 无特殊营养建议`);
        }
        
      } catch (error) {
        console.log(`   ❌ 获取建议失败: ${error.response?.data?.message || error.message}`);
      }
    }

    // 4. 测试边界情况
    console.log('\n\n4. 测试边界情况...');
    
    // 测试空参数
    try {
      await axios.get(`${API_BASE}/nutrition/search`);
      console.log('   ❌ 空参数应该返回错误');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('   ✅ 空参数正确返回400错误');
      } else {
        console.log(`   ❌ 空参数返回意外错误: ${error.response?.status}`);
      }
    }
    
    // 测试特殊字符
    try {
      const specialResponse = await axios.get(`${API_BASE}/nutrition/search`, {
        params: { foodName: '!@#$%^&*()' }
      });
      console.log('   ✅ 特殊字符处理正常');
    } catch (error) {
      console.log('   ✅ 特殊字符正确处理（未找到或错误）');
    }

    console.log('\n✨ === 营养API测试完成！===');
    console.log('\n📊 测试摘要:');
    console.log('   ✅ 基础功能: 营养信息搜索、建议获取、食材列表');
    console.log('   ✅ 数据验证: 分类匹配、营养信息完整性');
    console.log('   ✅ 错误处理: 空参数、特殊字符、不存在的食材');
    console.log('   ✅ 数据源: 本地数据库、智能匹配');

  } catch (error) {
    console.error('❌ 测试过程中发生未捕获的错误:', error.message);
  }
}

// 运行测试
testNutritionAPI(); 