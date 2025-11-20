// src/pages/Home/Home.js

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';

function Home() {
    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
            
            {/* 首页标题和欢迎信息 */}
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Find Your Next Career Opportunity
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Explore thousands of job listings and browse top companies hiring now.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 5 }}>
                
                {/* 导航按钮到职位列表 */}
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    startIcon={<SearchIcon />}
                    component={Link} 
                    to="/jobs"
                    sx={{ p: 2, minWidth: 200 }}
                >
                    Browse Jobs
                </Button>
                
                {/* 导航按钮到公司展示 */}
                <Button 
                    variant="outlined" 
                    color="primary" 
                    size="large"
                    startIcon={<BusinessIcon />}
                    component={Link} 
                    to="/companies"
                    sx={{ p: 2, minWidth: 200 }}
                >
                    Company Showcase
                </Button>
            </Box>
        </Container>
    );
}

export default Home;