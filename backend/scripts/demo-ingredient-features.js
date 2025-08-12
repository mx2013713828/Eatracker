/**
 * 食材管理功能演示脚本
 * 展示食材管理的主要功能特性
 */
const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eatracker');
    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('数据库连接失败:', error);
    process.exit(1);
  }
};

// 演示数据
const demoUsers = [
  {
    username: 'alice',
    password: '$2b$10$hashedpassword1',
    name: '爱丽丝',
    role: 'parent',
    dailyCalorieNeeds: 1800,
    nutritionNeeds: { protein: 60, carbs: 200, fat: 60, fiber: 25 }
  },
  {
    username: 'bob',
    password: '$2b$10$hashedpassword2', 
    name: '鲍勃',
    role: 'parent',
    dailyCalorieNeeds: 2200,
    nutritionNeeds: { protein: 80, carbs: 280, fat: 80, fiber: 30 }
  }
];

const demoIngredients = [
  // 爱丽丝的食材
  {
    name: '苹果',
    category: '水果',
    quantity: 8,
    unit: '个',
    nutrition: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 },
    expiryDate: new Date('2024-12-25') // 新鲜
  },
  {
    name: '牛奶',
    category: '蛋奶',
    quantity: 1,
    unit: '升',
    nutrition: { calories: 64, protein: 3.2, carbs: 4.8, fat: 3.6, fiber: 0 },
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5天后过期 - 即将过期
  },
  {
    name: '面包',
    category: '谷物',
    quantity: 1,
    unit: '包',
    nutrition: { calories: 265, protein: 9, carbs: 49, fat: 3.2, fiber: 2.8 },
    expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // 昨天过期 - 已过期
  },
  // 鲍勃的食材
  {
    name: '鸡胸肉',
    category: '肉类',
    quantity: 500,
    unit: '克',
    nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
    expiryDate: new Date('2024-12-20') // 新鲜
  },
  {
    name: '胡萝卜',
    category: '蔬菜',
    quantity: 3,
    unit: '根',
    nutrition: { calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 },
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3天后过期 - 即将过期
  }
];

// 主演示函数
const demonstrateFeatures = async () => {
  try {
    console.log('🥗 === 食材管理功能演示 ===\n');

    // 1. 清理现有数据
    console.log('1. 清理现有数据...');
    await mongoose.connection.db.collection('ingredients').deleteMany({});
    await mongoose.connection.db.collection('users').deleteMany({});
    console.log('✅ 数据清理完成\n');

    // 2. 创建演示用户
    console.log('2. 创建演示用户...');
    const userResults = await mongoose.connection.db.collection('users').insertMany(demoUsers);
    const userIds = Object.values(userResults.insertedIds);
    console.log(`✅ 创建了 ${userIds.length} 个用户\n`);

    // 3. 为每个用户添加食材
    console.log('3. 添加演示食材...');
    const ingredientsWithUserId = demoIngredients.map((ingredient, index) => ({
      ...ingredient,
      userId: userIds[index < 3 ? 0 : 1], // 前3个属于第一个用户，后2个属于第二个用户
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    await mongoose.connection.db.collection('ingredients').insertMany(ingredientsWithUserId);
    console.log(`✅ 添加了 ${ingredientsWithUserId.length} 个食材\n`);

    // 4. 数据隔离演示
    console.log('4. 演示数据隔离功能...');
    const aliceIngredients = await mongoose.connection.db.collection('ingredients')
      .find({ userId: userIds[0] }).toArray();
    const bobIngredients = await mongoose.connection.db.collection('ingredients')
      .find({ userId: userIds[1] }).toArray();
    
    console.log(`✅ 爱丽丝有 ${aliceIngredients.length} 个食材: ${aliceIngredients.map(i => i.name).join(', ')}`);
    console.log(`✅ 鲍勃有 ${bobIngredients.length} 个食材: ${bobIngredients.map(i => i.name).join(', ')}\n`);

    // 5. 过期状态分析
    console.log('5. 过期状态分析...');
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const expired = await mongoose.connection.db.collection('ingredients')
      .find({ expiryDate: { $lt: now } }).toArray();
    const expiringSoon = await mongoose.connection.db.collection('ingredients')
      .find({ 
        expiryDate: { $gte: now, $lte: weekLater }
      }).toArray();
    const fresh = await mongoose.connection.db.collection('ingredients')
      .find({ expiryDate: { $gt: weekLater } }).toArray();

    console.log(`🔴 已过期 (${expired.length}个): ${expired.map(i => i.name).join(', ')}`);
    console.log(`🟡 即将过期 (${expiringSoon.length}个): ${expiringSoon.map(i => i.name).join(', ')}`);  
    console.log(`🟢 新鲜 (${fresh.length}个): ${fresh.map(i => i.name).join(', ')}\n`);

    // 6. 营养信息统计
    console.log('6. 营养信息统计...');
    const allIngredients = await mongoose.connection.db.collection('ingredients').find().toArray();
    const totalNutrition = allIngredients.reduce((total, ingredient) => {
      const factor = ingredient.quantity / 100; // 假设营养信息是每100g的
      return {
        calories: total.calories + (ingredient.nutrition.calories * factor),
        protein: total.protein + (ingredient.nutrition.protein * factor),
        carbs: total.carbs + (ingredient.nutrition.carbs * factor),
        fat: total.fat + (ingredient.nutrition.fat * factor),
        fiber: total.fiber + (ingredient.nutrition.fiber * factor)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    console.log('🍎 总营养价值:');
    console.log(`   热量: ${totalNutrition.calories.toFixed(1)} kcal`);
    console.log(`   蛋白质: ${totalNutrition.protein.toFixed(1)} g`);
    console.log(`   碳水: ${totalNutrition.carbs.toFixed(1)} g`);
    console.log(`   脂肪: ${totalNutrition.fat.toFixed(1)} g`);
    console.log(`   纤维: ${totalNutrition.fiber.toFixed(1)} g\n`);

    // 7. 分类统计
    console.log('7. 食材分类统计...');
    const categoryStats = await mongoose.connection.db.collection('ingredients').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          items: { $push: '$name' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();

    categoryStats.forEach(cat => {
      console.log(`📂 ${cat._id}: ${cat.count}个 (${cat.items.join(', ')})`);
    });

    console.log('\n✨ === 演示完成！===');
    console.log('💡 主要功能特性:');
    console.log('   🔐 用户数据隔离 - 每个用户只能看到自己的食材');
    console.log('   📅 智能过期管理 - 自动判断和显示过期状态');
    console.log('   🥄 营养信息追踪 - 完整的营养成分记录');
    console.log('   📊 分类管理 - 按食材类型组织');
    console.log('   🔍 灵活查询 - 支持多种筛选条件');
    console.log('   💾 持久化存储 - 数据安全保存在MongoDB');

  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error);
  }
};

// 运行演示
const main = async () => {
  await connectDB();
  await demonstrateFeatures();
  mongoose.connection.close();
};

main().catch(console.error); 