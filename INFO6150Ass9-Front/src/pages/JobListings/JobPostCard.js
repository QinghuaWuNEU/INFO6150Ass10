// src/pages/JobListings/JobPostCard.js

import React from 'react';
import { 
    Card, 
    CardContent, 
    CardActions, 
    Typography, 
    Button, 
    Chip, 
    Box 
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function JobPostCard({ job }) {
    
    // 确保 requiredSkills 是一个数组，以便使用 map()
    const skillsArray = Array.isArray(job.requiredSkills) 
        ? job.requiredSkills 
        : (job.requiredSkills ? job.requiredSkills.split(',').map(s => s.trim()) : []);

    return (
        // Material UI Card (任务要求推荐使用的组件)
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                
                {/* 职位名称 (Job Title) */}
                <Typography gutterBottom variant="h5" component="div">
                    {job.title}
                </Typography>
                
                {/* 薪水 (Salary) - 任务要求 */}
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                    {job.salary || 'Competitive Salary'}
                </Typography>

                {/* 职位描述 */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description}
                </Typography>

                {/* 所需技能 (Required Skills) - 任务要求 */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Skills:</Typography>
                    {skillsArray.length > 0 ? (
                        skillsArray.map((skill, index) => (
                            <Chip key={index} label={skill} size="small" variant="outlined" />
                        ))
                    ) : (
                         <Chip label="Skills not specified" size="small" color="default" />
                    )}
                </Box>

                {/* 最后更新时间 */}
                <Typography variant="caption" display="block" color="text.disabled" sx={{ mt: 2 }}>
                    {job.lastUpdated}
                </Typography>
                
            </CardContent>
            
            <CardActions>
                {/* Material UI Button (任务要求推荐使用的组件) */}
                <Button 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    href={job.applyLink}
                    target="_blank"
                >
                    Apply Now
                </Button>
            </CardActions>
        </Card>
    );
}

export default JobPostCard;