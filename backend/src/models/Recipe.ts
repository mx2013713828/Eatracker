import mongoose from 'mongoose';

export interface IRecipe extends mongoose.Document {
  name: string;
  description: string;
  ingredients: Array<{
    ingredient: mongoose.Types.ObjectId;
    quantity: number;
    unit: string;
  }>;
  steps: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  imageUrl?: string;
}

const recipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [{
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
  }],
  steps: [{ type: String, required: true }],
  cookingTime: { type: Number, required: true }, // 以分钟为单位
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true }
  },
  imageUrl: { type: String }
}, {
  timestamps: true
});

export default mongoose.model<IRecipe>('Recipe', recipeSchema); 