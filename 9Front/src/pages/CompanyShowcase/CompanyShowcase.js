// src/pages/CompanyShowcase/CompanyShowcase.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import CompanyCard from './CompanyCard'; // 稍后创建

// ** 后端获取公司数据的 API URL **
const COMPANIES_API_URL = 'http://localhost:5000/api/companies';

// 假设公司数据结构为: [{ id: 1, name: "TechCorp", imageUrl: "/images/techcorp.jpg" }, ...]

function CompanyShowcase() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // 任务要求：使用 Axios 实现 API 请求
                const response = await axios.get(COMPANIES_API_URL, {
                    // 添加身份验证头，用于会话管理
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('userToken')}`
                    }
                });

                setCompanies(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching company data:', err);
                setError('Failed to load company images. Please ensure the backend is running and you are logged in.');
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Company Showcase Gallery
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}

            {!loading && !error && (
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    {companies.map((company) => (
                        <Grid item key={company.id} xs={12} sm={6} md={3}>
                            <CompanyCard company={company} />
                        </Grid>
                    ))}
                    
                    {companies.length === 0 && (
                         <Box sx={{ p: 4, textAlign: 'center', width: '100%' }}>
                            <Typography variant="h6" color="text.secondary">
                                No companies to display.
                            </Typography>
                        </Box>
                    )}
                </Grid>
            )}
        </Container>
    );
}

export default CompanyShowcase;