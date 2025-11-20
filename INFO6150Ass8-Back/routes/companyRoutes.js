// routes/companyRoutes.js
const express = require('express');
const router = express.Router();
// 假设您有一个 controller 用于处理逻辑
const { getCompanyList } = require('../controllers/companyController'); 
// Ass10修改点：引入 authMiddleware
const jobController = require('../controllers/jobController'); 
const authMiddleware = require('../middlewares/authMiddleware');

// 定义获取公司列表的端点
router.get('/companies', getCompanyList); // <--- 终点路径是 /companies

// Admin 专用：创建新职位
router.post('/create/job', authMiddleware, jobController.createJob);

// Employee 专用：获取所有职位
router.get('/jobs', authMiddleware, jobController.getJobs);

module.exports = router;