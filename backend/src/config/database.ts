import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eatracker';
    
    await mongoose.connect(mongoURI, {
      // 连接配置选项
      serverSelectionTimeoutMS: 5000, // 超时时间
      socketTimeoutMS: 45000, // Socket 超时时间
    });

    console.log('MongoDB 数据库连接成功');

    // 监听数据库连接事件
    mongoose.connection.on('error', err => {
      console.error('MongoDB 连接错误:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB 连接断开');
    });

    // 优雅关闭数据库连接
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB 连接已关闭');
        process.exit(0);
      } catch (err) {
        console.error('关闭 MongoDB 连接时出错:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

export default connectDB; 