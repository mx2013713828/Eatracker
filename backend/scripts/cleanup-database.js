/**
 * 数据库清理脚本
 * 用于删除测试数据和清理数据库
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

// 清理所有用户数据（级联删除相关食材）
const cleanupUsers = async () => {
  try {
    // 先删除所有食材（因为食材依赖于用户）
    const ingredientResult = await mongoose.connection.db.collection('ingredients').deleteMany({});
    console.log(`删除了 ${ingredientResult.deletedCount} 个食材`);
    
    // 再删除所有用户
    const userResult = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`删除了 ${userResult.deletedCount} 个用户`);
  } catch (error) {
    console.error('删除用户时出错:', error);
  }
};

// 清理所有数据
const cleanupAll = async () => {
  try {
    // 删除所有集合的数据
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const result = await mongoose.connection.db.collection(collection.name).deleteMany({});
      console.log(`清理集合 ${collection.name}: 删除了 ${result.deletedCount} 个文档`);
    }
  } catch (error) {
    console.error('清理数据时出错:', error);
  }
};

// 显示数据库统计信息
const showStats = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== 数据库统计信息 ===');
    
    for (const collection of collections) {
      const count = await mongoose.connection.db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} 个文档`);
    }
  } catch (error) {
    console.error('获取统计信息时出错:', error);
  }
};

// 清理特定用户的数据
const cleanupUserData = async (username) => {
  try {
    // 查找用户
    const user = await mongoose.connection.db.collection('users').findOne({ username });
    if (!user) {
      console.log(`用户 ${username} 不存在`);
      return;
    }

    // 删除用户的食材
    const ingredientResult = await mongoose.connection.db.collection('ingredients').deleteMany({ userId: user._id });
    console.log(`删除了用户 ${username} 的 ${ingredientResult.deletedCount} 个食材`);

    // 删除用户
    const userResult = await mongoose.connection.db.collection('users').deleteOne({ _id: user._id });
    console.log(`删除了用户 ${username}`);
  } catch (error) {
    console.error('删除用户数据时出错:', error);
  }
};

// 主函数
const main = async () => {
  await connectDB();
  
  const command = process.argv[2];
  const target = process.argv[3];
  
  switch (command) {
    case 'users':
      console.log('清理所有用户数据...');
      await cleanupUsers();
      break;
    case 'user':
      if (!target) {
        console.log('请指定要删除的用户名: node cleanup-database.js user <username>');
        break;
      }
      console.log(`清理用户 ${target} 的数据...`);
      await cleanupUserData(target);
      break;
    case 'all':
      console.log('清理所有数据...');
      await cleanupAll();
      break;
    case 'stats':
      await showStats();
      break;
    default:
      console.log('使用方法:');
      console.log('  node cleanup-database.js users       - 删除所有用户和食材');
      console.log('  node cleanup-database.js user <name> - 删除指定用户和其食材');
      console.log('  node cleanup-database.js all         - 删除所有数据');
      console.log('  node cleanup-database.js stats       - 显示统计信息');
      break;
  }
  
  await showStats();
  mongoose.connection.close();
};

main().catch(console.error); 