import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Ingredient, ingredientService } from '../services/ingredientService';
import AddIngredientDialog from '../components/AddIngredientDialog';

const Ingredients: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 加载食材列表
  const loadIngredients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ingredientService.getIngredients();
      setIngredients(data);
    } catch (error: any) {
      setError(error.response?.data?.message || '加载食材列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取食材列表
  useEffect(() => {
    loadIngredients();
  }, []);

  // 添加食材成功的回调
  const handleIngredientAdded = (newIngredient: Ingredient) => {
    setIngredients(prev => [...prev, newIngredient]);
  };

  // 删除食材
  const handleDeleteIngredient = (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!ingredientToDelete) return;

    try {
      setDeleting(true);
      await ingredientService.deleteIngredient(ingredientToDelete._id!);
      setIngredients(prev => prev.filter(item => item._id !== ingredientToDelete._id));
      setDeleteDialogOpen(false);
      setIngredientToDelete(null);
    } catch (error: any) {
      setError(error.response?.data?.message || '删除食材失败');
    } finally {
      setDeleting(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  };

  // 判断是否即将过期
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  // 判断是否已过期
  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  // 获取过期状态的颜色和文本
  const getExpiryStatus = (expiryDate: string) => {
    if (isExpired(expiryDate)) {
      return { color: 'error' as const, text: '已过期' };
    }
    if (isExpiringSoon(expiryDate)) {
      return { color: 'warning' as const, text: '即将过期' };
    }
    return { color: 'success' as const, text: '新鲜' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">食材管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          添加食材
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {ingredients.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            还没有添加任何食材
          </Typography>
          <Typography color="text.secondary" paragraph>
            点击"添加食材"按钮开始管理您的食材库存
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setAddDialogOpen(true)}
          >
            添加第一个食材
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>分类</TableCell>
                <TableCell>数量</TableCell>
                <TableCell>单位</TableCell>
                <TableCell>过期日期</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ingredients.map((ingredient) => {
                const expiryStatus = getExpiryStatus(ingredient.expiryDate);
                return (
                  <TableRow key={ingredient._id}>
                    <TableCell>{ingredient.name}</TableCell>
                    <TableCell>{ingredient.category}</TableCell>
                    <TableCell>{ingredient.quantity}</TableCell>
                    <TableCell>{ingredient.unit}</TableCell>
                    <TableCell>{formatDate(ingredient.expiryDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={expiryStatus.text}
                        color={expiryStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteIngredient(ingredient)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 添加食材对话框 */}
      <AddIngredientDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onIngredientAdded={handleIngredientAdded}
      />

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除食材 "{ingredientToDelete?.name}" 吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            取消
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? '删除中...' : '删除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ingredients; 