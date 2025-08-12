import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Ingredient, ingredientService } from '../services/ingredientService';

interface AddIngredientDialogProps {
  open: boolean;
  onClose: () => void;
  onIngredientAdded: (ingredient: Ingredient) => void;
}

// 食材分类选项
const categories = [
  '蔬菜',
  '水果',
  '肉类',
  '海鲜',
  '蛋奶',
  '谷物',
  '豆类',
  '调料',
  '其他',
];

// 单位选项
const units = [
  '克',
  '千克',
  '斤',
  '个',
  '只',
  '瓶',
  '包',
  '袋',
  '盒',
  '罐',
  '毫升',
  '升',
];

const AddIngredientDialog: React.FC<AddIngredientDialogProps> = ({
  open,
  onClose,
  onIngredientAdded,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    expiryDate: '',
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setError(''); // 清除错误信息
  };

  const handleNutritionChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      nutrition: {
        ...prev.nutrition,
        [field]: value,
      },
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name.trim()) {
      setError('请填写食材名称');
      return;
    }
    if (!formData.category) {
      setError('请选择食材分类');
      return;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError('请填写有效的数量');
      return;
    }
    if (!formData.unit) {
      setError('请选择单位');
      return;
    }
    if (!formData.expiryDate) {
      setError('请选择过期日期');
      return;
    }

    // 验证过期日期不能是过去的日期
    const expiryDate = new Date(formData.expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (expiryDate < today) {
      setError('过期日期不能是过去的日期');
      return;
    }

    // 验证营养信息
    const nutritionValues = Object.values(formData.nutrition);
    const hasNutritionData = nutritionValues.some(value => value !== '');
    
    if (hasNutritionData) {
      for (const [key, value] of Object.entries(formData.nutrition)) {
        if (value !== '' && (isNaN(Number(value)) || Number(value) < 0)) {
          setError(`${getNutritionLabel(key)}必须是有效的数字`);
          return;
        }
      }
    }

    setLoading(true);
    setError('');

    try {
      const ingredient = await ingredientService.addIngredient({
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        nutrition: {
          calories: Number(formData.nutrition.calories) || 0,
          protein: Number(formData.nutrition.protein) || 0,
          carbs: Number(formData.nutrition.carbs) || 0,
          fat: Number(formData.nutrition.fat) || 0,
          fiber: Number(formData.nutrition.fiber) || 0,
        },
      });

      onIngredientAdded(ingredient);
      handleClose();
    } catch (error: any) {
      setError(error.response?.data?.message || '添加食材失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        unit: '',
        expiryDate: '',
        nutrition: {
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
        },
      });
      setError('');
      onClose();
    }
  };

  const getNutritionLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      calories: '热量',
      protein: '蛋白质',
      carbs: '碳水化合物',
      fat: '脂肪',
      fiber: '纤维',
    };
    return labels[key] || key;
  };

  // 获取今天的日期字符串，用于设置最小日期
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>添加食材</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* 基本信息 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                基本信息
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="食材名称"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="分类"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                disabled={loading}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="数量"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                required
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="单位"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                required
                disabled={loading}
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="过期日期"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                required
                disabled={loading}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTodayString() }}
              />
            </Grid>

            {/* 营养信息 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                营养信息 (可选)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="热量 (kcal/100g)"
                value={formData.nutrition.calories}
                onChange={(e) => handleNutritionChange('calories', e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="蛋白质 (g/100g)"
                value={formData.nutrition.protein}
                onChange={(e) => handleNutritionChange('protein', e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="碳水化合物 (g/100g)"
                value={formData.nutrition.carbs}
                onChange={(e) => handleNutritionChange('carbs', e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="脂肪 (g/100g)"
                value={formData.nutrition.fat}
                onChange={(e) => handleNutritionChange('fat', e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="纤维 (g/100g)"
                value={formData.nutrition.fiber}
                onChange={(e) => handleNutritionChange('fiber', e.target.value)}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            取消
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '添加中...' : '添加食材'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddIngredientDialog; 