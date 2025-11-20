// src/pages/JobListings/JobListings.js

import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import JobPostCard from './JobPostCard'; // 稍后创建

//import { jobPosts } from '../../data/jobPosts'; // 导入静态数据
import axios from 'axios';
import { useSelector } from 'react-redux'; // 用于获取 Token

const API_URL = 'http://localhost:5000/api/jobs';

function JobListings() {
    // ⚠️ 状态：用于存储从 API 获取的职位列表
    const [jobPosts, setJobPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ⚠️ 从 Redux Store 中获取用户的 token
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError('');

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        // ⚠️ 关键：在 Header 中携带 Token 进行认证
                        'Authorization': `Bearer ${token}`, 
                    },
                };

                // 发送 GET 请求获取职位列表
                const response = await axios.get(API_URL, config);
                
                // 假设后端返回的数据是职位数组
                setJobPosts(response.data);
                setLoading(false);

            } catch (err) {
                setLoading(false);
                const errorMessage = err.response?.data?.message || 'Failed to fetch job listings. Please try again.';
                setError(errorMessage);
                console.error('Error fetching jobs:', err);
            }
        };

        // 仅在 token 存在时才进行 API 调用
        if (token) {
            fetchJobs();
        } else {
            // 如果 token 丢失，理论上 ProtectedRoute 会将用户踢走
            setLoading(false);
        }
    }, [token]);


    // -----------------------------------------------------------
    // 渲染加载和错误状态
    // -----------------------------------------------------------
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading job listings...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }
    
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Available Job Listings
            </Typography>
            
            {/* 使用 React 的 map() 函数动态渲染组件 */}
            {/* Material UI Grid 用于创建响应式布局 */}
            <Grid container spacing={4} sx={{ mt: 2 }}>
                {jobPosts.map((job) => (
                    <Grid item key={job._id} xs={12} sm={6} md={4}>
                        {/* 渲染单个职位卡片 */}
                        <JobPostCard job={job} />
                    </Grid>
                ))}
            </Grid>

            {/* 如果列表为空 (尽管我们使用的是静态数据)，显示提示 */}
            {jobPosts.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No job postings available at the moment.
                    </Typography>
                </Box>
            )}
        </Container>
    );
}

export default JobListings;