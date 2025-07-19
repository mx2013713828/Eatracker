import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // 表单验证
    if (!formData.username.trim()) {
      setError('请输入用户名');
      return;
    }
    if (!formData.name.trim()) {
      setError('请输入姓名');
      return;
    }
    if (formData.password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      console.log('开始注册请求...');
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username.trim(),
        password: formData.password,
        name: formData.name.trim(),
      });
      
      console.log('注册成功:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setShowSuccess(true);
      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: any) {
      console.error('注册失败:', error);
      if (error.response) {
        console.error('服务器响应:', error.response.data);
        setError(error.response.data.message || '注册失败');
      } else if (error.request) {
        console.error('没有收到响应');
        setError('服务器无响应，请检查网络连接');
      } else {
        console.error('请求错误:', error.message);
        setError('请求错误: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            注册
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="用户名"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              error={!!error && error.includes('用户名')}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="姓名"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={!!error && error.includes('姓名')}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="密码"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={!!error && error.includes('密码')}
              disabled={loading}
              helperText="密码长度至少为6位"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="确认密码"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              error={!!error && error.includes('密码')}
              disabled={loading}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : '注册'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                {"已有账号？立即登录"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          注册成功！正在跳转...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register; 