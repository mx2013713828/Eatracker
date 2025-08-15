import React, { useState, useEffect } from 'react';
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
  Chip,
  Box,
  Autocomplete,
  Card,
  CardContent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Ingredient, ingredientService } from '../services/ingredientService';
import { nutritionService, NutritionSearchResult, SupportedFood } from '../services/nutritionService';

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

  // 新增营养搜索相关状态
  const [nutritionSearching, setNutritionSearching] = useState(false);
  const [nutritionResults, setNutritionResults] = useState<NutritionSearchResult[]>([]);
  const [supportedFoods, setSupportedFoods] = useState<SupportedFood[]>([]);
  const [showNutritionSuggestions, setShowNutritionSuggestions] = useState(false);
  const [selectedNutritionResult, setSelectedNutritionResult] = useState<NutritionSearchResult | null>(null);

  // 加载支持的食材列表
  useEffect(() => {
    const loadSupportedFoods = async () => {
      try {
        const foods = await nutritionService.getSupportedFoods();
        setSupportedFoods(foods);
      } catch (error) {
        console.error('加载支持食材列表失败:', error);
      }
    };
    
    if (open) {
      loadSupportedFoods();
    }
  }, [open]);

  // 搜索营养信息
  const searchNutritionInfo = async (foodName: string) => {
    if (!foodName.trim()) return;
    
    setNutritionSearching(true);
    setShowNutritionSuggestions(false);
    
    try {
      const results = await nutritionService.searchFoodNutrition(foodName);
      setNutritionResults(results);
      if (results.length > 0) {
        setShowNutritionSuggestions(true);
      }
    } catch (error) {
      console.error('搜索营养信息失败:', error);
      setError('搜索营养信息失败，请稍后重试');
    } finally {
      setNutritionSearching(false);
    }
  };

  // 应用营养信息
  const applyNutritionInfo = (result: NutritionSearchResult) => {
    setSelectedNutritionResult(result);
    
    // 自动填充营养信息
    setFormData(prev => ({
      ...prev,
      name: result.name,
      category: result.category || prev.category,
      nutrition: {
        calories: result.nutrition.calories.toString(),
        protein: result.nutrition.protein.toString(),
        carbs: result.nutrition.carbs.toString(),
        fat: result.nutrition.fat.toString(),
        fiber: result.nutrition.fiber.toString(),
      }
    }));
    
    setShowNutritionSuggestions(false);
    setError('');
  };

  // 修改名称输入处理
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setFormData(prev => ({ ...prev, name: newName }));
    setError('');
    
    // 清除之前的选择
    if (selectedNutritionResult && selectedNutritionResult.name !== newName) {
      setSelectedNutritionResult(null);
    }
  };

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
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" component="div">
            添加食材
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Grid container spacing={2}>
              {/* 食材名称 - 增强版 */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Autocomplete
                    freeSolo
                    options={nutritionService.getFoodNameSuggestions(formData.name, supportedFoods)}
                    value={formData.name}
                    onInputChange={(event, newValue) => {
                      setFormData(prev => ({ ...prev, name: newValue || '' }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="食材名称"
                        required
                        fullWidth
                        placeholder="请输入食材名称，如：苹果、鸡胸肉"
                        onChange={handleNameChange}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: selectedNutritionResult && (
                            <Chip 
                              size="small" 
                              label={`${selectedNutritionResult.nutritionFormatted.confidence} 可信度`}
                              color="success"
                              sx={{ ml: 1 }}
                            />
                          )
                        }}
                      />
                    )}
                    sx={{ flexGrow: 1 }}
                  />
                  
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => searchNutritionInfo(formData.name)}
                    disabled={!formData.name.trim() || nutritionSearching}
                    startIcon={nutritionSearching ? <CircularProgress size={16} /> : <SearchIcon />}
                    sx={{ minWidth: 120 }}
                  >
                    {nutritionSearching ? '搜索中' : '搜索营养'}
                  </Button>
                </Box>
                
                {/* 营养信息搜索结果 */}
                {showNutritionSuggestions && nutritionResults.length > 0 && (
                  <Card sx={{ mt: 2, border: 1, borderColor: 'primary.main' }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <AutoFixHighIcon sx={{ mr: 1, fontSize: 18 }} />
                        找到 {nutritionResults.length} 个营养信息建议
                      </Typography>
                      
                      {nutritionResults.map((result, index) => (
                        <Card 
                          key={result.id} 
                          variant="outlined" 
                          sx={{ 
                            mt: 1, 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                            border: selectedNutritionResult?.id === result.id ? 2 : 1,
                            borderColor: selectedNutritionResult?.id === result.id ? 'primary.main' : 'divider'
                          }}
                          onClick={() => applyNutritionInfo(result)}
                        >
                          <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {result.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {result.description}
                                </Typography>
                              </Box>
                              <Chip 
                                size="small" 
                                label={result.source === 'local' ? '本地数据' : result.source === 'usda' ? 'USDA' : '智能匹配'} 
                                color={result.source === 'local' ? 'success' : result.source === 'usda' ? 'info' : 'warning'}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                              <Chip size="small" label={result.nutritionFormatted.calories} />
                              <Chip size="small" label={`蛋白质 ${result.nutritionFormatted.protein}`} />
                              <Chip size="small" label={`碳水 ${result.nutritionFormatted.carbs}`} />
                              <Chip size="small" label={`脂肪 ${result.nutritionFormatted.fat}`} />
                              <Chip size="small" label={`纤维 ${result.nutritionFormatted.fiber}`} />
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Button 
                        type="button"
                        size="small" 
                        onClick={() => setShowNutritionSuggestions(false)}
                        sx={{ mt: 1 }}
                      >
                        关闭建议
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Grid>
              
              {/* 其他现有字段... */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="分类"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  select
                  required
                  fullWidth
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
                  label="数量"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  required
                  fullWidth
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="单位"
                  name="unit"
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                  select
                  required
                  fullWidth
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
                  label="过期日期"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: getTodayString(),
                  }}
                />
              </Grid>
              
              {/* 营养成分标题 - 添加提示 */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  营养成分 (每100g)
                  {selectedNutritionResult && (
                    <Chip 
                      size="small" 
                      label="已自动填充" 
                      color="success" 
                      sx={{ ml: 2 }}
                    />
                  )}
                </Typography>
              </Grid>
              
              {/* 营养成分字段保持原样... */}
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
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button type="button" onClick={handleClose} disabled={loading}>
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