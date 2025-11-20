// src/pages/Admin/AddJobPage.js

import React, { useState } from 'react';
import { 
    Container, 
    Typography, 
    Box, 
    TextField, 
    Button, 
    Alert, 
    CircularProgress 
} from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux'; // 用于获取 Token
import { useNavigate } from 'react-router-dom';

// 假设您的后端API基础URL
const API_URL = 'http://localhost:5000/api/create/job';

function AddJobPage() {
    const navigate = useNavigate();
    // ⚠️ 从 Redux Store 中获取用户的 token
    const { token } = useSelector((state) => state.auth);
    
    // 状态管理
    const [formData, setFormData] = useState({
        companyName: '',
        jobTitle: '',
        description: '',
        salary: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // 成功或失败的提示信息
    const [isSuccess, setIsSuccess] = useState(false);

    // 处理表单输入变化
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // 清空提示信息
        setIsSuccess(false);
        setLoading(true);

        // 简单的客户端验证
        const requiredFields = ['companyName', 'jobTitle', 'description', 'salary'];
        const isFormValid = requiredFields.every(field => formData[field].trim() !== '');

        if (!isFormValid) {
            setMessage('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    // ⚠️ 关键：在 Header 中携带 Token 进行认证
                    'Authorization': `Bearer ${token}`, 
                },
            };

            const response = await axios.post(API_URL, formData, config);
            
            setMessage(response.data.message || 'Job posted successfully!');
            setIsSuccess(true);
            setLoading(false);

            // 可选：提交成功后清空表单
            setFormData({ companyName: '', jobTitle: '', description: '', salary: '' });
            
            // 可选：1秒后导航到 Jobs 列表页
            setTimeout(() => {
                 navigate('/jobs');
            }, 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to post job. Please check server status.';
            setMessage(errorMessage);
            setIsSuccess(false);
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 3,
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: 3
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Add New Job Post
                </Typography>

                {/* 消息提示 */}
                {message && (
                    <Alert severity={isSuccess ? 'success' : 'error'}>
                        {message}
                    </Alert>
                )}

                {/* 公司名称 */}
                <TextField
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                
                {/* 职位名称 */}
                <TextField
                    label="Job Title"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                {/* 职位描述 */}
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    multiline
                    rows={4}
                    fullWidth
                />

                {/* 薪资 */}
                <TextField
                    label="Salary (e.g., $80,000 - $100,000)"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Posting...' : 'Post Job'}
                </Button>
            </Box>
        </Container>
    );
}

export default AddJobPage;