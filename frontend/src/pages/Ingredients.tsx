import React from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Ingredients: React.FC = () => {
  // 示例数据
  const ingredients = [
    {
      id: 1,
      name: '胡萝卜',
      category: '蔬菜',
      quantity: 500,
      unit: '克',
      expiryDate: '2024-03-20',
    },
    // 更多食材...
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">食材管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // 处理添加食材
          }}
        >
          添加食材
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell>分类</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>单位</TableCell>
              <TableCell>过期日期</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{ingredient.category}</TableCell>
                <TableCell>{ingredient.quantity}</TableCell>
                <TableCell>{ingredient.unit}</TableCell>
                <TableCell>{ingredient.expiryDate}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">
                    编辑
                  </Button>
                  <Button size="small" color="error">
                    删除
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Ingredients; 