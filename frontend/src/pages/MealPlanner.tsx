import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
} from '@mui/material';

const MealPlanner: React.FC = () => {
  const [selectedDay, setSelectedDay] = React.useState(0);

  const days = ['今天', '明天', '后天'];
  const meals = [
    {
      id: 1,
      time: '早餐',
      dishes: [
        { id: 1, name: '牛奶', calories: 150 },
        { id: 2, name: '全麦面包', calories: 200 },
      ],
    },
    {
      id: 2,
      time: '午餐',
      dishes: [
        { id: 3, name: '米饭', calories: 200 },
        { id: 4, name: '清炒青菜', calories: 100 },
        { id: 5, name: '红烧肉', calories: 300 },
      ],
    },
    {
      id: 3,
      time: '晚餐',
      dishes: [
        { id: 6, name: '米饭', calories: 200 },
        { id: 7, name: '番茄炒蛋', calories: 150 },
      ],
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        膳食计划
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedDay}
          onChange={(_, newValue) => setSelectedDay(newValue)}
          variant="fullWidth"
        >
          {days.map((day, index) => (
            <Tab key={day} label={day} />
          ))}
        </Tabs>
      </Paper>

      {meals.map((meal) => (
        <Paper key={meal.id} sx={{ mb: 2 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">{meal.time}</Typography>
            <List>
              {meal.dishes.map((dish) => (
                <React.Fragment key={dish.id}>
                  <ListItem>
                    <ListItemText
                      primary={dish.name}
                      secondary={`${dish.calories} 卡路里`}
                    />
                    <ListItemSecondaryAction>
                      <Button size="small" color="error">
                        移除
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" color="primary">
                添加菜品
              </Button>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default MealPlanner; 