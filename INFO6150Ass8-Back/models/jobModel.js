// models/jobModel.js

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    jobTitle: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    salary: {
        type: String, // 使用 String 更灵活，例如 "Competitive" 或 "$80k - $100k"
        required: true,
    },
    // 可选：添加创建者ID，用于未来权限控制
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false, 
    },
}, {
    timestamps: true, // 记录职位创建时间
});

module.exports = mongoose.model('Job', JobSchema);