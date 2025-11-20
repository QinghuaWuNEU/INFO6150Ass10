// src/pages/Contact.js

import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

function Contact() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Contact Us
            </Typography>
            <Box sx={{ mt: 3, p: 3, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Get in Touch
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon><EmailIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Email" secondary="support@jobportal.com" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><PhoneIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Phone" secondary="+1 (555) 666-4567" />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Address" secondary="123 Ass 9 Road, Boston, MA 02115" />
                    </ListItem>
                </List>
            </Box>
        </Container>
    );
}

export default Contact;