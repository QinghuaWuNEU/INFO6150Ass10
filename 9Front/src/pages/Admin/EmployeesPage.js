// src/pages/Admin/EmployeesPage.js

import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

// 假设您的后端 API URL
const API_URL = 'http://localhost:5000/user/users';

// -----------------------------------------------------------
// EmployeePage Component
// -----------------------------------------------------------

function EmployeesPage() {
    // ⚠️ 从 Redux Store 中获取用户的 token
    const { token } = useSelector((state) => state.auth);
    
    // 状态管理
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError('');

            try {
                const config = {
                    headers: {
                        // ⚠️ 关键：在 Header 中携带 Token 进行认证
                        'Authorization': `Bearer ${token}`, 
                    },
                };

                // 发送 GET 请求获取所有用户列表
                // 注意：后端配置了 .select('-password')，因此不会返回密码
                const response = await axios.get(API_URL, config);
                
                // 假设后端返回的数据是用户数组
                setUsers(response.data);
                setLoading(false);

            } catch (err) {
                setLoading(false);
                // 捕获权限或网络错误
                const errorMessage = err.response?.data?.error || 'Failed to fetch users list. Check your Admin privileges.';
                setError(errorMessage);
                console.error('Error fetching users:', err);
            }
        };

        // 仅在 token 存在时才进行 API 调用
        if (token) {
            fetchUsers();
        } else {
             // 如果没有 token，可以设置一个错误或跳转到登录页（App.js 的 ProtectedRoute 应该已经处理了跳转）
             setLoading(false);
             setError('Authorization token is missing.');
        }
    }, [token]);


    // -----------------------------------------------------------
    // 渲染加载和错误状态
    // -----------------------------------------------------------

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading employees...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }
    
    // -----------------------------------------------------------
    // 渲染用户表格
    // -----------------------------------------------------------

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Employee Management (Admin Portal)
            </Typography>

            {users.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>No users found in the database.</Alert>
            ) : (
                <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
                    <Table aria-label="employee table">
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Full Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Joined Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow 
                                    key={user._id} 
                                    // 根据用户类型设置背景色 (可选)
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, 
                                          backgroundColor: user.type === 'admin' ? '#fff3e0' : 'inherit' // 橙色系背景给管理员
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {user.fullName}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: user.type === 'admin' ? 'darkred' : 'darkgreen' }}>
                                        {user.type.toUpperCase()}
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}

export default EmployeesPage;