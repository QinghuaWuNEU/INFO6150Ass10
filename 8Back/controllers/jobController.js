// controllers/jobController.js

const Job = require('../models/jobModel');

// --- 1. Admin: POST /create/job ---
const createJob = async (req, res) => {
    // ⚠️ 前提：此函数已被认证中间件 (authMiddleware) 保护
    // 并且中间件已将用户 ID 和 type 附加到 req.user 上
    
    // if (req.user.type !== 'admin') { return res.status(403).json({ message: 'Only Admins can post jobs.' }); }

    const { companyName, jobTitle, description, salary } = req.body;

    if (!companyName || !jobTitle || !description || !salary) {
        return res.status(400).json({ message: 'All job fields are required.' });
    }

    try {
        const newJob = await Job.create({
            companyName,
            jobTitle,
            description,
            salary,
            postedBy: req.user.id, // 假设认证中间件将 ID 放入 req.user.id
        });

        res.status(201).json({ 
            message: 'Job posted successfully.', 
            jobId: newJob._id 
        });

    } catch (error) {
        console.error('Job creation error:', error);
        res.status(500).json({ message: 'Server error during job posting.' });
    }
};

// --- 2. Employee: GET /jobs ---
const getJobs = async (req, res) => {
    // ⚠️ 前提：此函数已被认证中间件 (authMiddleware) 保护
    
    try {
        // 获取所有职位，并按最新创建时间排序
        const jobs = await Job.find({})
            .sort({ createdAt: -1 });

        res.status(200).json(jobs);

    } catch (error) {
        console.error('Fetching jobs error:', error);
        res.status(500).json({ message: 'Server error fetching jobs.' });
    }
};


module.exports = {
    createJob,
    getJobs,
};