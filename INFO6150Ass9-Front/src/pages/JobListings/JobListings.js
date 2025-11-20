// src/pages/JobListings/JobListings.js

import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import JobPostCard from './JobPostCard'; // 稍后创建
import { jobPosts } from '../../data/jobPosts'; // 导入静态数据

function JobListings() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Available Job Listings
            </Typography>
            
            {/* 使用 React 的 map() 函数动态渲染组件 */}
            {/* Material UI Grid 用于创建响应式布局 */}
            <Grid container spacing={4} sx={{ mt: 2 }}>
                {jobPosts.map((job) => (
                    <Grid item key={job.id} xs={12} sm={6} md={4}>
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