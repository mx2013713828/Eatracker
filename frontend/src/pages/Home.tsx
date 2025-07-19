import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        欢迎使用一日三餐
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              今日营养摄入
            </Typography>
            {/* 这里将添加营养摄入图表 */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              推荐菜品
            </Typography>
            {/* 这里将添加推荐菜品列表 */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              食材库存提醒
            </Typography>
            {/* 这里将添加库存预警信息 */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 