import mongoose from 'mongoose';

export interface IIngredient extends mongoose.Document {
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
  expiryDate: Date;
}

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    fiber: { type: Number, required: true }
  },
  expiryDate: { type: Date, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IIngredient>('Ingredient', ingredientSchema); 