// src/pages/CompanyShowcase/CompanyCard.js

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

// 假设您的 Node.js 服务器运行在 5000 端口
const BASE_URL = 'http://localhost:5000';

function CompanyCard({ company }) {
    
    // 确保图片的完整路径。如果后端返回 "/images/logo.png"，则需要拼接 BASE_URL
    const fullImageUrl = company.imageUrl ? `${BASE_URL}${company.imageUrl}` : 'path/to/placeholder-image.jpg';

    return (
        // Material UI Card (任务要求推荐使用的组件)
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* Material UI CardMedia 用于显示图片 */}
            <CardMedia
                component="img"
                height="140"
                image={fullImageUrl} // 图片应从后端获取 [cite: 34]
                alt={company.name || 'Company Logo'}
                sx={{ objectFit: 'contain', p: 1 }}
            />
            
            <CardContent sx={{ flexGrow: 1 }}>
                
                {/* 公司名称 */}
                <Typography gutterBottom variant="h6" component="div" align="center">
                    {company.name || 'Unknown Company'}
                </Typography>
                
                {/* 您可以在这里添加公司简介或其他详细信息 */}
                {/* 2. 公司描述 (现在添加或检查这个字段) */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {company.description || "暂无描述信息。"}
                </Typography>
                
                {/* 3. 公司行业/领域 (现在添加或检查这个字段) */}
                <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="primary">
                        industry: {company.industry || "未知"}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}

export default CompanyCard;