// config/db.js

const mongoose = require('mongoose');

// 启用严格查询模式（推荐）
mongoose.set('strictQuery', true); 

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // 退出进程，失败时退出
        process.exit(1); 
    }
};

module.exports = connectDB;