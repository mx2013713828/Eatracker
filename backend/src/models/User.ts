import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  name: string;
  role: 'parent' | 'child';
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  dailyCalorieNeeds: number;
  nutritionNeeds: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  lastUpdated?: Date;
}

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['parent', 'child'], required: true },
  age: { type: Number },
  height: { type: Number },
  weight: { type: Number },
  bmi: { type: Number },
  dailyCalorieNeeds: { type: Number, required: true },
  nutritionNeeds: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true }
  },
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 添加中间件来自动计算BMI
userSchema.pre('save', function(next) {
  if (this.height && this.weight) {
    // BMI = 体重(kg) / (身高(m))²
    const heightInMeters = this.height / 100;
    this.bmi = Number((this.weight / (heightInMeters * heightInMeters)).toFixed(1));
  }
  next();
});

export default mongoose.model<IUser>('User', userSchema); 