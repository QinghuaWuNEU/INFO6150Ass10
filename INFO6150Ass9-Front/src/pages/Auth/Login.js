// src/pages/Auth/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

import { useDispatch } from 'react-redux'; // 引入 useDispatch
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice'; // 引入 action

// ** 后端登录API URL **
const LOGIN_URL = 'http://localhost:5000/user/login';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Ass10 修改点 2：引入 useDispatch
    const dispatch = useDispatch();

    // 原始的 handleLoginSuccess 已经不需要了，我们将在 handleSubmit 中直接处理 Redux 状态和导航
    /*
    // 假设在App.js中，我们有一个方式来更新认证状态（简化处理，实际中会用Context）
    const handleLoginSuccess = (token) => {
        // 存储 Token 用于会话管理 
        localStorage.setItem('userToken', token);
        // 重定向到主页
        navigate('/', { replace: true });
        // 刷新页面，确保App.js中的认证状态更新
        window.location.reload(); 
    };
    */

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Ass10 修改点 3a：派发登录开始 action
        dispatch(loginStart());
        try {
            // 使用 Axios 发送登录请求 
            const response = await axios.post(LOGIN_URL, {
                // 请确保这些字段名 ('username', 'password') 与您的后端API一致
                email: username,
                password: password,
            });

            const data = response.data; // Axios 响应数据在 .data 中

            // 假设您的后端在成功时返回 { user: { id, fullName, email, type }, token }
            const { token, user } = data;
            const userType = user.type; // 获取用户的类型 (admin 或 employee)
            const userName = user.fullName; // 获取用户的全名

            // Ass10 修改点 3b：派发登录成功 action，将 token 和包含 type 的 user 存入 Redux
            dispatch(loginSuccess({
                token: token,
                user: {
                    id: user.id,
                    fullName: userName,
                    type: userType
                }
            }));

            /* 删除
            // 假设您的后端在成功时返回一个包含JWT的响应，例如: { token: 'jwt-string' }
            const token = response.data.token; 
            
            if (token) {
                handleLoginSuccess(token);
            } else {
                setError('Login failed: No token received.');
            }
            */

            // Ass10 修改点 3c：清除本地存储，因为状态现在由 Redux 管理 (可选：如果您的 authSlice 依赖本地存储，可以保留)
            localStorage.setItem('userToken', token); // 暂时保留，以兼容旧组件

            // Ass10 修改点 4：基于用户类型进行导航
            if (userType === 'admin') {
                navigate('/admin/users', { replace: true }); // 管理员首页
            } else {
                navigate('/jobs', { replace: true }); // 员工首页
            }

            // 移除不必要的刷新
            // window.location.reload();

        } catch (err) {
            // 处理请求错误，如网络错误或401未授权
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'Invalid username or password.';
            setError(errorMessage);
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
                <Typography component="h1" variant="h5">
                    Job Portal Login
                </Typography>
                
                {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    {/* Material UI TextField  */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Material UI Button [cite: 41] */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;