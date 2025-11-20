// src/pages/About.js

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function About() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                About Our Job Portal
            </Typography>
            <Box sx={{ mt: 3 }}>
                <Typography variant="body1" paragraph>
                    Welcome to the Job Portal, developed as part of Assignment 9. 
                    This platform is built using React for dynamic content rendering, 
                    featuring Material UI components for a clean interface and Axios  
                    for handling secure API requests, including login and fetching company data.
                </Typography>
                <Typography variant="body1" paragraph>
                    Our focus is on delivering a seamless job search and company exploration experience.
                </Typography>
            </Box>
        </Container>
    );
}

export default About;