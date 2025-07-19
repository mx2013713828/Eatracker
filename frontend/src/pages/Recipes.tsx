import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Recipes: React.FC = () => {
  // 示例数据
  const recipes = [
    {
      id: 1,
      name: '番茄炒蛋',
      description: '经典家常菜，营养美味',
      imageUrl: 'https://example.com/tomato-egg.jpg',
      cookingTime: 15,
      difficulty: 'easy',
      calories: 200,
    },
    // 更多菜谱...
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">菜谱</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // 处理添加菜谱
          }}
        >
          添加菜谱
        </Button>
      </Box>

      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={recipe.imageUrl}
                alt={recipe.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {recipe.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {recipe.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={`${recipe.cookingTime}分钟`}
                    size="small"
                  />
                  <Chip
                    icon={<RestaurantIcon />}
                    label={`${recipe.calories}卡路里`}
                    size="small"
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small">查看详情</Button>
                <Button size="small">开始制作</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recipes; 