// app.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const companyRoutes = require('./routes/companyRoutes');
const cors = require('cors');
const companyData = require('./companyData'); // <-- 1. 引入公司数据



// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();

// 2. 必须在所有路由和 express.json() 之前使用 CORS
// 允许来自 http://localhost:3000 的请求（前端的实际运行端口）
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // 允许发送 headers 和 cookies
}));

// 允许解析 JSON 请求体
app.use(express.json());

// --- Swagger UI Setup  ---
// 访问路径为 http://localhost:3000/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 允许访问 /images 静态文件夹
// 任务要求图片保存在 "images" 文件夹中，这里设置静态服务
app.use('/images', express.static(path.join(__dirname, 'images')));

// 根路由
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 用户路由
app.use('/user', userRoutes);

// 2. 添加 Company Showcase API 路由 (新的路由)
app.get('/api/companies', (req, res) => {
    // 假设您不需要登录验证，直接返回数据
    res.json(companyData); 
});

// 错误处理中间件 (可选，但推荐用于捕获未处理的错误)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong on the server.',
        error: err.message
    });
});


const PORT = process.env.PORT || 5000;

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
);

app.use('/api', companyRoutes);

// Ass10新增
app.use('/user', userRoutes);

// 假设您的公司/Job 路由前缀是 /api 或 /jobs
app.use('/api', companyRoutes);

module.exports = app;